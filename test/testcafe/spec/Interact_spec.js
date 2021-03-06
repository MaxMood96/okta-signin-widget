import { ClientFunction, RequestMock, RequestLogger } from 'testcafe';
import BasePageObject from '../framework/page-objects/BasePageObject';
import TerminalPageObject from '../framework/page-objects/TerminalPageObject';
import { checkConsoleMessages } from '../framework/shared';
import xhrServerError from '../../../packages/playground/mocks/data/oauth2/error-feature-not-enabled';
import xhrWellKnownResponse from '../../../packages/playground/mocks/data/oauth2/well-known-openid-configuration.json';
import xhrInteractResponse from '../../../packages/playground/mocks/data/oauth2/interact.json';
import xhrIdentify from '../../../packages/playground/mocks/data/idp/idx/identify';

const expectIdentifyView =  {
  controller: 'primary-auth',
  formName: 'identify',
};

const expectTerminalView = {
  controller: null,
  formName: 'terminal'
};

// For these tests the widget will render once using default settings before we re-render using the interaction code flow
const initialRender = [
  'ready',
  'afterRender',
  expectIdentifyView,
  'afterRender',
  expectIdentifyView
];

const rerenderWidget = ClientFunction((settings) => {
  // function `renderPlaygroundWidget` is defined in playground/main.js
  window.renderPlaygroundWidget(settings);
});

const mockCrypto = ClientFunction(() => {
  if (typeof window.crypto === 'undefined') {
    window.crypto = {};
  }

  if (typeof window.crypto.subtle === 'undefined') {
    window.crypto.subtle = {
      digest: function () { 
        return Promise.resolve(65);
      }
    };
  }

  if (typeof Uint8Array === 'undefined') {
    window['Uint8Array'] = window.Number;
  }

  String.fromCharCode = function() {
    return 'mocked';
  };
});

const saveTransactionMeta = ClientFunction(meta => {
  const signIn = window.getWidgetInstance();
  const authClient = signIn.authClient;
  authClient.transactionManager.save(meta);
});

const interactMock = RequestMock()
  .onRequestTo('http://localhost:3000/oauth2/default/.well-known/openid-configuration')
  .respond(xhrWellKnownResponse, 200)
  .onRequestTo('http://localhost:3000/oauth2/default/v1/interact')
  .respond(xhrInteractResponse, 200)
  .onRequestTo('http://localhost:3000/idp/idx/introspect')
  .respond(xhrIdentify);

const errorMock = RequestMock()
  .onRequestTo('http://localhost:3000/oauth2/default/.well-known/openid-configuration')
  .respond(xhrWellKnownResponse, 200)
  .onRequestTo('http://localhost:3000/oauth2/default/v1/interact')
  .respond(xhrServerError, 400);


const requestLogger = RequestLogger(
  [
    /v1\/interact/,
    /idx\/introspect/
  ],
  {
    logRequestBody: true,
    stringifyRequestBody: true,
  }
);

fixture('Interact');

function decodeUrlEncodedRequestBody (body) {
  const params = {};
  const pairs = body.split('&');
  pairs.forEach(pair => {
    const split = pair.split('=');
    const key = split[0];
    const val = decodeURIComponent(split[1]);
    params[key] = val;
  });
  return params;
}

async function setup(t, options = {}) {
  const pageObject = new BasePageObject(t);
  await pageObject.navigateToPage();

  // wait for introspect from initial render
  await t.expect(requestLogger.count(() => true)).eql(1);
  requestLogger.clear();

  // Set saved transaction meta?
  if (options.transactionMeta) {
    await saveTransactionMeta(options.transactionMeta);
  }

  // Re-render the widget for interaction code flow
  await mockCrypto();
  await rerenderWidget({
    stateToken: undefined, 
    clientId: 'fake',
    redirectUri: 'http://doesnot-matter',
    useInteractionCodeFlow: true,
    authParams: {
      pkce: true,
      state: 'mock-state'
    }
  });
}

test.requestHooks(requestLogger, errorMock)('shows an error when feature is not enabled', async t => {
  await setup(t);

  const terminalPageObject = new TerminalPageObject(t);
  const errors = terminalPageObject.getErrorMessages();
  await t.expect(errors.isError()).ok();
  await t.expect(errors.getTextContent()).eql('The requested feature is not enabled in this environment.');

  await checkConsoleMessages([
    // initial render will produce some kind of error (we are not trying to test this)
    'ready',
    'afterRender',
    expectIdentifyView,
    'afterRender',
    expectTerminalView,

    // 2nd render with interaction code flow should go straight to terminal view
    'ready',
    'afterRender',
    expectTerminalView
  ]);
});

test.requestHooks(requestLogger, interactMock)('receives interaction_handle from interact endpoint', async t => {
  await setup(t);

  await t.expect(requestLogger.count(() => true)).eql(2); // interact, introspect
  let req = requestLogger.requests[0].request; // interact
  const params = decodeUrlEncodedRequestBody(req.body);
  await t.expect(params['state']).eql('mock-state');
  await t.expect(params['client_id']).eql('fake');
  await t.expect(params['scope']).eql('openid email');
  await t.expect(params['redirect_uri']).eql('http://doesnot-matter');
  await t.expect(params['code_challenge_method']).eql('S256');
  await t.expect(typeof params['code_challenge']).eql('string');
  await t.expect(req.method).eql('post');
  await t.expect(req.url).eql('http://localhost:3000/oauth2/default/v1/interact');

  await checkConsoleMessages(initialRender.concat([
    'ready',
    'afterRender',
    expectIdentifyView
  ]));
});

test.requestHooks(requestLogger, interactMock)('passes interaction handle to introspect endpoint', async t => {
  await setup(t);

  await t.expect(requestLogger.count(() => true)).eql(2); // interact, introspect
  const req = requestLogger.requests[1].request; // introspect
  const reqBody = JSON.parse(req.body);
  await t.expect(reqBody).eql({
    interactionHandle: 'fake_interaction_handle',
  });
  await t.expect(req.method).eql('post');
  await t.expect(req.url).eql('http://localhost:3000/idp/idx/introspect');

  await checkConsoleMessages(initialRender.concat([
    'ready',
    'afterRender',
    expectIdentifyView
  ]));
});

test.requestHooks(requestLogger, interactMock)('passes saved interaction handle to introspect endpoint', async t => {
  await setup(t, {
    transactionMeta: {
      interactionHandle: 'my_very_fake_handle',
      codeVerifier: 'fake',
      codeChallenge: 'totally_fake',
      codeChallengeMethod: 'S256',

      // These properties need to match config. See `isTransactionMetaValid``
      clientId: 'fake',
      redirectUri: 'http://doesnot-matter',
    }
  });

  await t.expect(requestLogger.count(() => true)).eql(1); // only introspect, no interact
  const req = requestLogger.requests[0].request;
  const reqBody = JSON.parse(req.body);
  await t.expect(reqBody).eql({
    interactionHandle: 'my_very_fake_handle',
  });
  await t.expect(req.method).eql('post');
  await t.expect(req.url).eql('http://localhost:3000/idp/idx/introspect');

  await checkConsoleMessages(initialRender.concat([
    'ready',
    'afterRender',
    expectIdentifyView
  ]));
});
