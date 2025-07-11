/* eslint max-len: [2, 140], camelcase: 0 */
import { $ } from '@okta/courage';
import $sandbox from 'sandbox';
import Logger from 'util/Logger';
import Util from 'util/Util';


describe('util/Util', () => {
  describe('transformErrorXHR', () => {
    it('errorSummary shows network connection error when status is 0', () => {
      const xhr = {
        status: 0,
      };

      Util.transformErrorXHR(xhr);
      expect(xhr.responseJSON.errorSummary).toEqual(
        'Unable to connect to the server. Please check your network connection.'
      );
    });

    it('errorSummary shows unsupported response from server when there are no responseJSON and no responseText', () => {
      const xhr = {
        status: 400,
      };

      Util.transformErrorXHR(xhr);
      expect(xhr.responseJSON.errorSummary).toEqual('There was an unsupported response from server.');
    });

    it('errorSummary shows unsupported response from server when there are no responseJSON and responseText is not valid JSON', () => {
      const xhr = {
        status: 400,
        responseText: '<html>'
      };

      Util.transformErrorXHR(xhr);
      expect(xhr.responseJSON.errorSummary).toEqual('There was an unsupported response from server.');
    });

    it('errorSummary is set from responseText when there is no responseJSON', () => {
      const responseText = { errorSummary: 'errorSummary from responseText' };
      const xhr = {
        status: 400,
        responseText: responseText,
      };

      Util.transformErrorXHR(xhr);
      expect(xhr.responseJSON.errorSummary).toEqual('errorSummary from responseText');
    });

    it('If there is an errorCauses array and there is no error code, get errorSummary from errorCauses array', () => {
      const errorCauses = [
        {
          errorSummary: 'errorSummary from errorCauses',
        },
      ];
      const xhr = {
        status: 400,
        responseJSON: {
          errorCauses: errorCauses,
        },
      };

      Util.transformErrorXHR(xhr);
      expect(xhr.responseJSON.errorSummary).toEqual('errorSummary from errorCauses');
      expect(xhr.responseJSON.errorCauses).toBe(errorCauses);
    });

    it('If there is an errorCauses array and there is an invalid error code, get errorSummary from errorCauses array', () => {
      const errorCauses = [
        {
          errorSummary: 'errorSummary from errorCauses',
        },
      ];
      const xhr = {
        status: 400,
        responseJSON: {
          errorCauses: errorCauses,
          errorCode: 'E01212AB',
        },
      };

      Util.transformErrorXHR(xhr);
      expect(xhr.responseJSON.errorSummary).toEqual('errorSummary from errorCauses');
      expect(xhr.responseJSON.errorCauses).toBe(errorCauses);
    });

    it('If there is a valid error code, get errorSummary from that and delete errorCauses array', () => {
      const errorCauses = [
        {
          errorSummary: 'errorSummary from errorCauses',
        },
      ];
      const xhr = {
        status: 400,
        responseJSON: {
          errorCauses: errorCauses,
          errorCode: 'E0000017',
        },
      };

      Util.transformErrorXHR(xhr);
      expect(xhr.responseJSON.errorSummary).toEqual('Password reset failed');
      expect(xhr.responseJSON.errorCauses).not.toBeDefined();
    });
  });

  describe('expandLanguages', () => {
    it('works with an empty array', () => {
      const languages = [];
      const expected = [];

      expect(Util.expandLanguages(languages)).toEqual(expected);
    });

    it('works in the default "en" case', () => {
      const languages = ['en'];
      const expected = ['en'];

      expect(Util.expandLanguages(languages)).toEqual(expected);
    });

    it('expands with 2 parts (regions) in the correct order', () => {
      const languages = ['pt-BR'];
      const expected = ['pt-BR', 'pt'];

      expect(Util.expandLanguages(languages)).toEqual(expected);
    });

    it('expands when there are 3 parts (regions+dialects) in the correct order', () => {
      const languages = ['de-DE-bavarian'];
      const expected = ['de-DE-bavarian', 'de-DE', 'de'];

      expect(Util.expandLanguages(languages)).toEqual(expected);
    });

    it('returns a flattened array with multiple languages', () => {
      const languages = ['en', 'pt-BR', 'ja', 'zh-CN'];
      const expected = ['en', 'pt-BR', 'pt', 'ja', 'zh-CN', 'zh'];

      expect(Util.expandLanguages(languages)).toEqual(expected);
    });

    it('filters out any duplicates that are generated', () => {
      const languages = ['en-US', 'en'];
      const expected = ['en-US', 'en'];

      expect(Util.expandLanguages(languages)).toEqual(expected);
    });

    it('filters out duplicates that are passed in (correct order)', () => {
      const languages = ['en-US', 'ja', 'en'];
      const expected = ['en-US', 'en', 'ja'];

      expect(Util.expandLanguages(languages)).toEqual(expected);
    });
  });

  describe('toLower', () => {
    it('lowercases all string entries in a given array', () => {
      const arr = ['Hi', 'THERE', 'i', 'wOUld'];
      const expected = ['hi', 'there', 'i', 'would'];

      expect(Util.toLower(arr)).toEqual(expected);
    });
  });

  describe('debugMessage', () => {
    it('formats template literal strings into a consistent format', () => {
      jest.spyOn(Logger, 'warn');
      const debugMessage = `
          Multi-line
          String
          Message
        `;

      Util.debugMessage(debugMessage);
      expect(Logger.warn).toHaveBeenCalledWith('\nMulti-line\nString\nMessage\n');
    });
  });

  describe('redirect', () => {
    beforeEach(() => {
      jest.spyOn(Logger, 'error');
      jest.spyOn(console, 'error').mockImplementation(() => { /* silence log */ });
    });

    it('should load the URL', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'href',
        }
      });
      Util.redirect('http://example.com/idp/123', window);
      expect(window.location.href).toEqual('http://example.com/idp/123');
    });

    it('should not load an empty URL', () => {
      Util.redirect('');
      expect(Logger.error).toHaveBeenCalledTimes(1);
      expect(Logger.error).toHaveBeenCalledWith('Cannot redirect to empty URL: ()');
    });
  });

  describe('executeOnVisiblePage', () => {
    beforeEach(() => {
      jest.spyOn(document, 'addEventListener');
      jest.spyOn(document, 'removeEventListener');
    });

    afterEach(() => {
      Object.defineProperty(document, 'visibilityState', {
        value: 'visible',
        configurable: true,
      });
    });

    it('shall execute callback immediately if document is visible', () => {
      const cb = jest.fn();
      Object.defineProperty(document, 'visibilityState', {
        value: 'visible',
        configurable: true,
      });
      Util.executeOnVisiblePage(cb);

      expect(cb).toHaveBeenCalledTimes(1);
      expect(document.addEventListener).not.toHaveBeenCalled();
      expect(document.removeEventListener).not.toHaveBeenCalled();
    });

    it('shall execute callback only when document become visible', () => {
      const cb = jest.fn();
      Object.defineProperty(document, 'visibilityState', {
        value: 'hidden',
        configurable: true,
      });
      Util.executeOnVisiblePage(cb);

      // should listen to visibilitychange
      expect(cb).not.toHaveBeenCalled();
      expect(document.addEventListener).toHaveBeenCalledTimes(1);
      expect(document.removeEventListener).toHaveBeenCalledTimes(0);
      const addArgs = document.addEventListener.mock.calls[0];
      expect(addArgs[0]).toBe('visibilitychange');
      const addedCallback = addArgs[1];

      // simulate visibilitychange
      Object.defineProperty(document, 'visibilityState', {
        value: 'visible',
        configurable: true,
      });
      addedCallback.call(null);

      expect(cb).toHaveBeenCalledTimes(1);
      expect(document.removeEventListener).toHaveBeenCalledTimes(1);
      const removeArgs = document.removeEventListener.mock.calls[0];
      expect(removeArgs[0]).toBe('visibilitychange');
      const removedCallback = removeArgs[1];
      expect(removedCallback).toEqual(addedCallback);
    });
  });

  describe('redirectWithFormGet', () => {
    beforeEach(() => {
      jest.spyOn(Logger, 'error');
      jest.spyOn(console, 'error').mockImplementation(() => { /* silence log */ });
      jest.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => jest.fn());
      // Normally act as if the form lock is not set
      jest.spyOn(Util, 'getRedirectWithFormLock').mockImplementation(() => false);
      jest.spyOn(Util, 'setRedirectWithFormLock').mockImplementation(() => {});
      $sandbox.append('<div id="okta-sign-in"></div>');
    });

    afterEach(() => {
      $sandbox.empty();
    });

    it('shall prevent redirects being initiated while one is already in progress', () => {
      jest.spyOn(Util, 'getRedirectWithFormLock').mockImplementationOnce(() => false);
      const setLockMock = jest.spyOn(Util, 'setRedirectWithFormLock').mockImplementation(() => {});

      Util.redirectWithFormGet('http://example.com/idp/123');

      expect(setLockMock).toHaveBeenCalledTimes(1);
      expect(Logger.error).not.toHaveBeenCalled();

      jest.spyOn(Util, 'getRedirectWithFormLock').mockImplementationOnce(() => true);

      Util.redirectWithFormGet('http://example.com/idp/123');

      expect(Logger.error).toHaveBeenCalledWith('Cannot redirect with form, already in progress');
      expect($('#okta-sign-in form :submit').length).toBe(1);
      expect($('#okta-sign-in form :submit')[0].click).toHaveBeenCalledTimes(1);
      expect($('#okta-sign-in').html()).toBe(
        '<form method="get" style="display: none;" action="http://example.com/idp/123">' +
          '<input type="submit">' +
          '</form>'
      );
    });

    it('shall submit a plain URL', () => {
      Util.redirectWithFormGet('http://example.com/idp/123');

      expect($('#okta-sign-in form :submit')[0].click).toHaveBeenCalledTimes(1);
      expect($('#okta-sign-in').html()).toBe(
        '<form method="get" style="display: none;" action="http://example.com/idp/123">' +
          '<input type="submit">' +
          '</form>'
      );
    });

    it('shall submit URL that has query pamaters', () => {
      Util.redirectWithFormGet('http://example.com/idp/123?foo=aaa&bar=bbb');

      expect($('#okta-sign-in form :submit')[0].click).toHaveBeenCalledTimes(1);
      expect($('#okta-sign-in').html()).toBe(
        '<form method="get" style="display: none;" action="http://example.com/idp/123">' +
          '<input name="foo" type="hidden" value="aaa">' +
          '<input name="bar" type="hidden" value="bbb">' +
          '<input type="submit">' +
          '</form>'
      );
    });

    it('shall submit URL that has query pamaters and fragement', () => {
      Util.redirectWithFormGet('http://example.com/idp/123?redirectURI=https%3A%2F%2Ffoo.com#hello=okta');

      expect($('#okta-sign-in form :submit')[0].click).toHaveBeenCalledTimes(1);
      expect($('#okta-sign-in').html()).toBe(
        '<form method="get" style="display: none;" action="http://example.com/idp/123#hello=okta">' +
          '<input name="redirectURI" type="hidden" value="https://foo.com">' +
          '<input type="submit">' +
          '</form>'
      );
    });

    it('shall submit URL that encoded XSS value', () => {
      Util.redirectWithFormGet(
        'http://example.com/idp/123?foo=a%22%2F%3E%3Cimg%20error%3D%22alert(11)%22%20src%3D%22xx%22%2F%3E'
      );

      expect($('#okta-sign-in form :submit')[0].click).toHaveBeenCalledTimes(1);
      expect($('#okta-sign-in').html()).toBe(
        '<form method="get" style="display: none;" action="http://example.com/idp/123">' +
          '<input name="foo" type="hidden" value="a&quot;/><img error=&quot;alert(11)&quot; src=&quot;xx&quot;/>">' +
          '<input type="submit">' +
          '</form>'
      );
    });

    it('shall submit URL that XSS value', () => {
      Util.redirectWithFormGet('http://example.com/idp/123?foo=%22/><img error="alert(2)" src="yy"/>');

      expect($('#okta-sign-in form :submit')[0].click).toHaveBeenCalledTimes(1);
      expect($('#okta-sign-in').html()).toBe(
        '<form method="get" style="display: none;" action="http://example.com/idp/123">' +
          '<input name="foo" type="hidden" value="&quot;/><img error">' +
          '<input type="submit">' +
          '</form>'
      );
    });

    it('shall not submit anything if the okta-sign-in container doesnot exists', () => {
      $('#okta-sign-in').remove();
      Util.redirectWithFormGet('http://example.com/idp/123');
      expect($('#okta-sign-in form').length).toBe(0);
      expect(Logger.error).toHaveBeenCalledTimes(1);
      expect(Logger.error).toHaveBeenCalledWith('Cannot find okta-sign-in container append to which a form');
    });

    it('shall not submit an empty URL', () => {
      Util.redirectWithFormGet('');
      expect($('#okta-sign-in form').length).toBe(0);
      expect(Logger.error).toHaveBeenCalledTimes(1);
      expect(Logger.error).toHaveBeenCalledWith('Cannot redirect to empty URL: ()');
    });
  });

  describe('searchParamsToString', () => {
    it('encodes keys and values', () => {
      const params = {
        a: 1,
        'key 2': 'value/2'
      };
      const expected = 'a=1&key%202=value%2F2';
      expect(Util.searchParamsToString(params)).toEqual(expected);
    });

    it('skips parameters with nullish values', () => {
      const params = {
        a: 1,
        b: undefined,
        c: null,
        d: '',
        e: ' ',
        f: 0,
        g: '0'
      };
      const expected = 'a=1&d=&e=%20&f=0&g=0';
      expect(Util.searchParamsToString(params)).toEqual(expected);
    });
  });
});
