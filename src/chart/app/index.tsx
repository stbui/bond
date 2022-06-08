import React from 'react';
import ReactDom from 'react-dom';
import underscore from 'underscore';
import '../lib/hidpi-canvas-polyfill';
import jbridge from '../lib/jbridge';
import * as util from '../util';
import Provider from '../component/provider';
import Chartlayout from '../component/chartlayout';
import chartlayout2 from '../model/chartlayout';
import shamlayout from '../model/shamlayout';
import {
  processChartConfig,
  loadChartConfig,
  loadDeviceInfo,
  loadLogPara,
  normalizeChartConfig,
  defaultChartConfig,
} from '../config';

const $root = document.getElementById('chart_container');
function renderShamLayout(shamLayout, chartConfig) {
  shamLayout.fakeInit(chartConfig);

  ReactDom.render(
    <Provider chartLayout={shamLayout}>
      <Chartlayout
        height={document.documentElement.clientHeight}
        widht={document.documentElement.clientWidth}
      />
    </Provider>,
    $root,
  );
}
function renderLayout(chartLayout, chartConfig) {
  chartLayout.init(chartConfig).then(function () {
    ReactDom.unmountComponentAtNode($root);
    ReactDom.render(
      <Provider chartLayout={chartLayout}>
        <Chartlayout
          height={document.documentElement.clientHeight}
          widht={document.documentElement.clientWidth}
        />
      </Provider>,
      $root,
    );
  });
}
export function initChartLayout(options) {
  if (options === void 0) {
    options = {};
  }
  // openDatabase().then(() => {
  var chartConfig = underscore.extend(
    {},
    options.chartConfig,
    processChartConfig(util.getUrlParams()),
  );
  var customOptions = options.customOptions || {};
  if (true) {
    loadChartConfig().then(function (localConfig) {
      chartConfig = normalizeChartConfig(
        _.defaults({}, chartConfig, localConfig, defaultChartConfig),
      );
      // renderShamLayout(new ShamLayoutModel(customOptions), chartConfig)
      renderLayout(new chartlayout2(customOptions), chartConfig);
    });
  } else {
    jbridge.ready().then(function () {
      return Promise.all([
        loadLogPara(),
        loadDeviceInfo(),
        loadChartConfig(),
      ]).then(function (resolved) {
        // 参数优先级，url参数 > 内置参数 > 记忆参数 > 默认参数
        chartConfig = normalizeChartConfig(
          _.defaults({}, chartConfig, resolved[2], defaultChartConfig),
        );
        // setLogParams(resolved[0])
        customOptions.deviceInfo = resolved[1];
        renderShamLayout(new shamlayout(customOptions), chartConfig);
        renderLayout(new chartlayout2(customOptions), chartConfig);
      });
    });
  }
  // })
}
