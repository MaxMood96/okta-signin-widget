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

import { Box } from '@mui/material';
import { FunctionComponent, h } from 'preact';

import { IconProps } from '../../types';

export const OSXStoreIcon: FunctionComponent<IconProps> = ({ description }) => (
  <Box
    component="svg"
    sx={{ width: '188px !important', height: '48px !important' }}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
  >
    <title>{description}</title>
    <path
      d="M176.225 0H11.781c-.44 0-.874 0-1.313.003-.368.002-.732.009-1.103.015-.806.01-1.61.08-2.405.212a7.998 7.998 0 00-2.28.752A7.725 7.725 0 00.572 6.626a15.592 15.592 0 00-.215 2.402c-.011.368-.012.737-.018 1.105V37.87c.006.373.007.734.018 1.107.01.805.081 1.608.215 2.402.132.796.385 1.566.75 2.285a7.452 7.452 0 001.414 1.937 7.53 7.53 0 001.942 1.415c.718.365 1.487.62 2.281.757.796.13 1.6.201 2.405.212.371.008.735.013 1.103.013.439.002.873.002 1.313.002h164.444c.432 0 .87 0 1.301-.002.366 0 .741-.005 1.106-.013.805-.01 1.607-.081 2.4-.212a8.155 8.155 0 002.29-.757 7.523 7.523 0 001.941-1.415 7.682 7.682 0 001.418-1.937c.362-.72.613-1.49.743-2.285.134-.794.208-1.597.222-2.402.005-.373.005-.734.005-1.106.009-.437.009-.87.009-1.313V11.444c0-.44 0-.876-.009-1.31 0-.369 0-.738-.005-1.106a16.123 16.123 0 00-.222-2.402 7.96 7.96 0 00-.743-2.284 7.758 7.758 0 00-3.359-3.36 8.11 8.11 0 00-2.29-.752 15.64 15.64 0 00-2.4-.212c-.365-.006-.74-.013-1.106-.016C177.095 0 176.657 0 176.225 0z"
      fill="#A6A6A6"
    />
    <path
      d="M10.474 46.95c-.366 0-.723-.005-1.085-.013a15.214 15.214 0 01-2.243-.196 7.061 7.061 0 01-1.988-.657 6.488 6.488 0 01-1.677-1.22 6.383 6.383 0 01-1.224-1.676 6.865 6.865 0 01-.652-1.989 14.897 14.897 0 01-.2-2.25c-.007-.253-.017-1.095-.017-1.095V10.133s.01-.83.017-1.073c.01-.753.076-1.504.199-2.247a6.907 6.907 0 01.652-1.994A6.448 6.448 0 013.474 3.14a6.678 6.678 0 011.683-1.227 6.988 6.988 0 011.984-.653 15.103 15.103 0 012.25-.197l1.084-.014H177.52l1.096.015c.747.009 1.493.074 2.23.195.698.119 1.373.34 2.005.658a6.708 6.708 0 012.898 2.903c.313.624.529 1.291.643 1.98.124.748.194 1.505.208 2.264.004.34.004.705.004 1.068.009.45.009.878.009 1.31v25.115c0 .435 0 .86-.009 1.29 0 .39 0 .748-.005 1.115a15.352 15.352 0 01-.205 2.225 6.901 6.901 0 01-.648 2.004 6.575 6.575 0 01-1.219 1.663c-.49.496-1.057.91-1.679 1.227-.63.319-1.305.541-2.002.66-.742.12-1.491.186-2.243.195-.351.008-.719.013-1.077.013l-1.3.002-165.752-.002z"
      fill="#000"
    />
    <path
      d="M30.062 24.36a5.939 5.939 0 012.828-4.982 6.08 6.08 0 00-4.79-2.589c-2.014-.211-3.968 1.206-4.995 1.206-1.046 0-2.627-1.185-4.33-1.15a6.378 6.378 0 00-5.367 3.274c-2.321 4.018-.59 9.923 1.633 13.17 1.113 1.591 2.412 3.368 4.113 3.305 1.665-.07 2.287-1.062 4.296-1.062 1.99 0 2.573 1.062 4.309 1.022 1.786-.03 2.911-1.598 3.984-3.203a13.151 13.151 0 001.823-3.711 5.739 5.739 0 01-3.504-5.28zM26.785 14.653a5.847 5.847 0 001.337-4.19 5.949 5.949 0 00-3.85 1.992A5.563 5.563 0 0022.9 16.49a4.92 4.92 0 003.885-1.836zM55.719 36.594V25.626h-.073L51.154 36.48H49.44l-4.504-10.854h-.071v10.968h-2.107V21.692h2.675l4.822 11.763h.082l4.813-11.763h2.685v14.902H55.72zM59.615 33.507c0-1.9 1.456-3.047 4.038-3.202l2.975-.165v-.826c0-1.208-.796-1.89-2.15-1.89a2.077 2.077 0 00-2.281 1.529H60.11c.062-1.963 1.89-3.356 4.43-3.356 2.592 0 4.306 1.414 4.306 3.552v7.446H66.71v-1.787h-.052a3.885 3.885 0 01-3.429 1.973 3.293 3.293 0 01-3.614-3.274zm7.013-.981v-.837l-2.676.166c-1.332.083-2.086.66-2.086 1.59 0 .95.786 1.57 1.983 1.57a2.605 2.605 0 002.779-2.489zM78.212 29.469a2.399 2.399 0 00-2.56-2.003c-1.715 0-2.85 1.435-2.85 3.697 0 2.313 1.145 3.707 2.869 3.707a2.338 2.338 0 002.54-1.951h2.149a4.342 4.342 0 01-4.709 3.81c-3.098 0-5.122-2.117-5.122-5.566 0-3.377 2.024-5.566 5.101-5.566a4.367 4.367 0 014.71 3.872h-2.128zM94.851 32.566h-5.68l-1.364 4.028h-2.406l5.38-14.902h2.5l5.38 14.902h-2.447l-1.363-4.028zm-5.091-1.858h4.502l-2.22-6.537h-.062l-2.22 6.537zM110.28 31.163c0 3.376-1.807 5.545-4.534 5.545a3.68 3.68 0 01-3.418-1.9h-.052v5.38h-2.23V25.73h2.158v1.807h.042a3.853 3.853 0 013.459-1.92c2.757 0 4.575 2.179 4.575 5.546zm-2.292 0c0-2.2-1.137-3.646-2.871-3.646-1.704 0-2.85 1.477-2.85 3.646 0 2.189 1.146 3.655 2.85 3.655 1.734 0 2.871-1.436 2.871-3.655zM122.238 31.163c0 3.376-1.807 5.545-4.534 5.545a3.68 3.68 0 01-3.418-1.9h-.052v5.38h-2.23V25.73h2.159v1.807h.041a3.853 3.853 0 013.459-1.92c2.757 0 4.575 2.179 4.575 5.546zm-2.292 0c0-2.2-1.137-3.646-2.871-3.646-1.704 0-2.85 1.477-2.85 3.646 0 2.189 1.146 3.655 2.85 3.655 1.734 0 2.871-1.436 2.871-3.655zM130.141 32.442c.165 1.478 1.601 2.448 3.563 2.448 1.879 0 3.232-.97 3.232-2.302 0-1.157-.816-1.85-2.747-2.324l-1.931-.465c-2.737-.661-4.007-1.941-4.007-4.018 0-2.57 2.241-4.337 5.422-4.337 3.149 0 5.308 1.766 5.38 4.337h-2.251c-.135-1.487-1.364-2.384-3.16-2.384-1.797 0-3.026.908-3.026 2.23 0 1.053.785 1.673 2.706 2.148l1.641.403c3.058.723 4.328 1.951 4.328 4.13 0 2.789-2.22 4.535-5.753 4.535-3.304 0-5.535-1.705-5.68-4.4h2.283zM144.104 23.16v2.57h2.066v1.766h-2.066v5.99c0 .93.414 1.364 1.322 1.364a6.96 6.96 0 00.733-.052v1.756c-.408.076-.823.11-1.238.103-2.2 0-3.058-.826-3.058-2.933v-6.228h-1.579V25.73h1.579v-2.57h2.241zM147.365 31.163c0-3.418 2.014-5.566 5.153-5.566 3.15 0 5.154 2.148 5.154 5.566 0 3.428-1.993 5.567-5.154 5.567-3.159 0-5.153-2.14-5.153-5.567zm8.035 0c0-2.345-1.075-3.729-2.882-3.729-1.807 0-2.882 1.395-2.882 3.73 0 2.353 1.075 3.727 2.882 3.727 1.807 0 2.882-1.374 2.882-3.728zM159.512 25.73h2.127v1.849h.051a2.596 2.596 0 012.614-1.963c.257 0 .513.027.764.083v2.086a3.121 3.121 0 00-1.002-.134 2.249 2.249 0 00-2.324 2.5v6.443h-2.23V25.73zM175.348 33.404c-.3 1.972-2.22 3.325-4.678 3.325-3.16 0-5.122-2.117-5.122-5.514 0-3.408 1.972-5.618 5.028-5.618 3.006 0 4.896 2.064 4.896 5.359v.764h-7.673v.135a2.84 2.84 0 00.767 2.198 2.822 2.822 0 002.156.879 2.458 2.458 0 002.509-1.528h2.117zm-7.538-3.243h5.431a2.606 2.606 0 00-.73-1.96 2.61 2.61 0 00-1.935-.797 2.749 2.749 0 00-2.766 2.757zM45.731 10.477a3.167 3.167 0 013.37 3.558c0 2.287-1.237 3.602-3.37 3.602h-2.586v-7.16h2.586zm-1.474 6.148h1.35a2.251 2.251 0 002.361-2.576 2.257 2.257 0 00-2.36-2.56h-1.35v5.136zM50.357 14.933a2.56 2.56 0 115.096 0 2.56 2.56 0 11-5.096 0zm4 0c0-1.172-.527-1.857-1.45-1.857-.927 0-1.449.685-1.449 1.857 0 1.18.522 1.86 1.449 1.86.923 0 1.45-.684 1.45-1.86zM62.228 17.637h-1.106l-1.117-3.98h-.085l-1.112 3.98h-1.095l-1.49-5.404h1.082l.968 4.124h.08l1.11-4.124h1.023l1.111 4.124h.085l.963-4.124h1.066l-1.483 5.404zM64.964 12.234h1.027v.858h.08a1.618 1.618 0 011.612-.963 1.759 1.759 0 011.87 2.01v3.498h-1.066v-3.23c0-.868-.377-1.3-1.166-1.3a1.24 1.24 0 00-1.29 1.369v3.161h-1.067v-5.403zM71.252 10.124h1.067v7.513h-1.067v-7.513zM73.801 14.933a2.56 2.56 0 115.097 0 2.56 2.56 0 11-5.097 0zm4 0c0-1.172-.526-1.857-1.45-1.857-.927 0-1.448.685-1.448 1.857 0 1.18.521 1.86 1.448 1.86.924 0 1.45-.684 1.45-1.86zM80.02 16.109c0-.973.725-1.534 2.01-1.614l1.464-.084v-.466c0-.571-.377-.893-1.106-.893-.596 0-1.008.218-1.127.6H80.23c.11-.928.982-1.523 2.208-1.523 1.355 0 2.119.674 2.119 1.816v3.692h-1.027v-.76h-.084a1.817 1.817 0 01-1.623.849 1.633 1.633 0 01-1.802-1.617zm3.474-.462v-.452l-1.32.085c-.744.05-1.081.302-1.081.779 0 .486.422.77 1.002.77a1.272 1.272 0 001.399-1.182zM85.957 14.933c0-1.708.878-2.79 2.243-2.79a1.78 1.78 0 011.657.949h.08v-2.968h1.066v7.513h-1.022v-.854h-.084a1.875 1.875 0 01-1.697.943c-1.375 0-2.243-1.082-2.243-2.793zm1.102 0c0 1.146.54 1.836 1.443 1.836.9 0 1.455-.7 1.455-1.831 0-1.127-.562-1.836-1.455-1.836-.897 0-1.443.694-1.443 1.83zM95.415 14.933a2.56 2.56 0 115.097 0 2.555 2.555 0 01-2.548 2.808 2.559 2.559 0 01-2.549-2.808zm4 0c0-1.172-.526-1.857-1.45-1.857-.927 0-1.448.685-1.448 1.857 0 1.18.521 1.86 1.448 1.86.924 0 1.45-.684 1.45-1.86zM101.943 12.234h1.027v.858h.08a1.616 1.616 0 011.612-.963 1.762 1.762 0 011.418.556 1.75 1.75 0 01.452 1.454v3.498h-1.066v-3.23c0-.868-.377-1.3-1.166-1.3a1.238 1.238 0 00-1.29 1.369v3.161h-1.067v-5.403zM112.558 10.888v1.37h1.171v.898h-1.171v2.778c0 .566.233.814.764.814.136 0 .272-.008.407-.024v.888a3.503 3.503 0 01-.58.054c-1.186 0-1.658-.417-1.658-1.459v-3.051h-.858v-.898h.858v-1.37h1.067zM115.186 10.124h1.057v2.978h.084a1.663 1.663 0 011.648-.968 1.776 1.776 0 011.404.57 1.778 1.778 0 01.456 1.444v3.489h-1.067V14.41c0-.863-.402-1.3-1.155-1.3a1.266 1.266 0 00-1.291.83 1.274 1.274 0 00-.07.54v3.156h-1.066v-7.513zM126.053 16.178a2.188 2.188 0 01-2.341 1.563 2.456 2.456 0 01-2.496-2.789 2.5 2.5 0 011.455-2.607 2.49 2.49 0 011.036-.216c1.504 0 2.411 1.027 2.411 2.724v.372h-3.816v.06a1.44 1.44 0 00.377 1.092 1.434 1.434 0 001.062.456 1.297 1.297 0 001.286-.655h1.026zm-3.751-1.742h2.73a1.315 1.315 0 00-.356-.994 1.297 1.297 0 00-.975-.405 1.382 1.382 0 00-1.399 1.4z"
      fill="#fff"
    />
  </Box>
);
