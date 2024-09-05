#!/bin/bash
export CI=true

source $OKTA_HOME/$REPO/scripts/setup.sh

setup_service java 1.8.222

export RUN_SAUCE_TESTS=mobile
export SAUCE_USERNAME=OktaSignInWidget
get_vault_secret_key devex/sauce-labs accessKey SAUCE_ACCESS_KEY
export TEST_SUITE_TYPE="junit"
export TEST_RESULT_FILE_DIR="${REPO}/build2"
echo ${TEST_SUITE_TYPE} > ${TEST_SUITE_TYPE_FILE}
echo ${TEST_RESULT_FILE_DIR} > ${TEST_RESULT_FILE_DIR_FILE}

# We use the below OIE enabled org and clients for OIE tests
export WIDGET_TEST_SERVER=https://oie-signin-widget.okta.com
export WIDGET_SPA_CLIENT_ID=0oa8lrg7ojTsbJgRQ696
export WIDGET_WEB_CLIENT_ID=0oa8ls36zUZj7oFJ2696
export WIDGET_BASIC_USER=testuser
get_vault_secret_key devex/okta-signin-widget widget_basic_password WIDGET_BASIC_PASSWORD

export ORG_OIE_ENABLED=true
get_vault_secret_key devex/auth-js-sdk-vars a18n_api_key A18N_API_KEY
get_vault_secret_key devex/okta-signin-widget test_org_okta_api_key OKTA_CLIENT_TOKEN

# Build
if ! yarn workspace v3 build:release; then
  echo "build failed! Exiting..."
  exit ${TEST_FAILURE}
fi

if ! setup_service node v14.18.2 &> /dev/null; then
  echo "Failed to install node"
  exit ${FAILED_SETUP}
fi

# Run tests
export DISABLE_CSP=1
export CDN_ONLY=1
export BUNDLE="next"
export TARGET="CROSS_BROWSER"
export USE_MIN=1

if ! yarn test:e2e; then
  echo "e2e saucelabs test failed! Exiting..."
  exit ${PUBLISH_TYPE_AND_RESULT_DIR_BUT_ALWAYS_FAIL}
fi

exit ${PUBLISH_TYPE_AND_RESULT_DIR}