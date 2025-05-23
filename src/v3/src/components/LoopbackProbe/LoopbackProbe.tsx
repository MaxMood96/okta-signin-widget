/*
 * Copyright (c) 2022-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { IdxActionParams } from '@okta/okta-auth-js';
import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

import Logger from '../../../../util/Logger';
import { useWidgetContext } from '../../contexts';
import { ActionParams, LoopbackProbeElement } from '../../types';
import { isAndroid, makeRequest } from '../../util';

const LoopbackProbe: FunctionComponent<{ uischema: LoopbackProbeElement }> = ({
  uischema: {
    options: {
      deviceChallengePayload,
      cancelStep,
      step,
    },
  },
}) => {
  const widgetContext = useWidgetContext();
  const { authClient, idxTransaction, setIdxTransaction } = widgetContext;

  const probeTimeoutMillis: number = typeof deviceChallengePayload.probeTimeoutMillis === 'undefined'
    ? 100 : deviceChallengePayload.probeTimeoutMillis;
  const ports: string[] = deviceChallengePayload.ports || [];
  const {
    domain,
    httpsDomain,
    challengeRequest,
  } = deviceChallengePayload;

  const submitHandler = async (stepName: string) => {
    const payload: IdxActionParams = {
      step: stepName,
    };
    if (typeof idxTransaction?.context.stateHandle !== 'undefined') {
      payload.stateHandle = idxTransaction.context.stateHandle;
    }
    const newTransaction = await authClient?.idx.proceed(payload);
    setIdxTransaction(newTransaction);
  };

  const cancelHandler = async (params?: ActionParams) => {
    const payload: IdxActionParams = {
      actions: [{
        name: cancelStep,
        params,
      }],
    };
    if (typeof idxTransaction?.context.stateHandle !== 'undefined') {
      payload.stateHandle = idxTransaction.context.stateHandle;
    }
    const newTransaction = await authClient?.idx.proceed(payload);
    setIdxTransaction(newTransaction);
  };

  /* eslint-disable no-await-in-loop, no-continue */
  useEffect(() => {
    const doLoopback = async () => {
      let foundPort = false;

      let baseUrls = ports.map((port) => `${domain}:${port}`);
      if (httpsDomain) {
        Logger.info('httpsDomain enabled, will probe and challenge https first');
        const httpsBaseUrls = ports.map((port) => `${httpsDomain}:${port}`);
        baseUrls = [...httpsBaseUrls, ...baseUrls];
      }

      // loop over each domain:port
      // eslint-disable-next-line no-restricted-syntax
      for (const baseUrl of baseUrls) {
        try {
          // probe the url
          const probeResponse = await makeRequest({
            method: 'GET',
            /*
            OKTA-278573 in loopback server, SSL handshake sometimes takes more than 100ms and thus needs additional
            timeout however, increasing timeout is a temporary solution since user will need to wait much longer in
            worst case.
            TODO: Android timeout is temporarily set to 3000ms and needs optimization post-Beta.
            OKTA-365427 introduces probeTimeoutMillis; but we should also consider probeTimeoutMillisHTTPS for
            customizing timeouts in the more costly Android and other (keyless) HTTPS scenarios.
            */
            timeout: isAndroid() ? 3_000 : probeTimeoutMillis,
            url: `${baseUrl}/probe`,
          });

          if (!probeResponse.ok) {
            Logger.error(`Authenticator is not listening on url ${baseUrl}.`);
            // there's more ports to try, continue with next port
            continue;
          }

          // try port with challenge request
          const challengeResponse = await makeRequest({
            url: `${baseUrl}/challenge`,
            method: 'POST',
            timeout: 300_000,
            data: JSON.stringify({ challengeRequest }),
          });

          if (!challengeResponse.ok) {
            // Windows and MacOS return status code 503 when
            // there are multiple profiles on the device and
            // the wrong OS profile responds to the challenge request
            if (challengeResponse.status !== 503) {
              // when challenge response with other error statuses,
              // cancel polling and return immediately
              cancelHandler({
                reason: 'OV_RETURNED_ERROR',
                statusCode: challengeResponse.status,
              });

              return;
            }
            // no errors but this is not the port we're looking for
            // continue with next loop iteration
            continue;
          }
          // challenge response was a 2xx, end probing
          foundPort = true;
          break;
        } catch (e) {
          // only for unexpected error conditions (e.g. fetch throws an error)
          Logger.error(`Something unexpected happened while we were checking url ${baseUrl}`);
        }
      }

      if (foundPort) {
        // success condition
        // once the OV challenge succeeds, triggers another polling right away without waiting
        // for the next ongoing polling to be triggered to make the authentication flow go faster
        submitHandler(step);
      } else {
        // no more ports to probe: cancel polling and return
        Logger.error('No available ports. Loopback server failed and polling is cancelled.');

        cancelHandler({
          reason: 'OV_UNREACHABLE_BY_LOOPBACK',
          statusCode: null,
        });
      }
    };

    doLoopback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeRequest]);
  /* eslint-enable no-await-in-loop, no-continue */

  return null;
};

export default LoopbackProbe;
