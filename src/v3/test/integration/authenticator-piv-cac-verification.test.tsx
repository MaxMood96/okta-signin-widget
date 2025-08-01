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

import mockResponse from '../../src/mocks/response/idp/idx/introspect/identify-with-piv-cac.json';
import { setup } from './util';

describe('authenticator-piv-cac-verification', () => {
  it('renders form with idpDisplay as PRIMARY/default', async () => {
    const { container, findByLabelText } = await setup({ mockResponse });
    await findByLabelText(/Username/);
    expect(container).toMatchSnapshot();
  });

  it('renders form with idpDisplay as SECONDARY', async () => {
    const { container, findByLabelText } = await setup({
      mockResponse, widgetOptions: { idpDisplay: 'SECONDARY' },
    });
    await findByLabelText(/Username/);
    expect(container).toMatchSnapshot();
  });

  it('renders form with custom PIV/CAC Button label and class', async () => {
    const { container, findByLabelText } = await setup({
      mockResponse,
      widgetOptions: { piv: { text: 'My custom PIV Button Label', className: 'custom-piv-class' } },
    });
    await findByLabelText(/Username/);
    expect(container).toMatchSnapshot();
  });

  it('should render PIV/CAC view when clicking PIV button', async () => {
    const {
      container, user, findByRole, findByLabelText,
    } = await setup({ mockResponse });

    const pivButton = await findByRole('button', { name: 'Sign in with PIV / CAC card' });

    await user.click(pivButton);

    const heading = await findByRole('heading', { level: 1 });
    expect(heading.textContent).toBe('PIV / CAC card');
    // Wait for Spinner to appear
    await findByLabelText('Processing...');
    expect(container).toMatchSnapshot();
  });
});
