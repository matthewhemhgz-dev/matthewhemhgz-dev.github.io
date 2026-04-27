#!/bin/bash

# 打开网站
agent-browser open http://localhost:4327/

# 等待页面加载完成
agent-browser wait --load networkidle

# 测试移动设备尺寸 (375px)
echo "测试移动设备尺寸: 375px"
agent-browser set viewport 375 812
agent-browser wait 1000
agent-browser screenshot --full mobile-375px.png

# 测试平板尺寸 (768px)
echo "测试平板尺寸: 768px"
agent-browser set viewport 768 1024
agent-browser wait 1000
agent-browser screenshot --full tablet-768px.png

# 测试桌面尺寸 (1024px)
echo "测试桌面尺寸: 1024px"
agent-browser set viewport 1024 1440
agent-browser wait 1000
agent-browser screenshot --full desktop-1024px.png

# 测试大屏幕桌面尺寸 (1440px)
echo "测试大屏幕桌面尺寸: 1440px"
agent-browser set viewport 1440 2000
agent-browser wait 1000
agent-browser screenshot --full large-desktop-1440px.png

# 测试超大屏幕尺寸 (1920px)
echo "测试超大屏幕尺寸: 1920px"
agent-browser set viewport 1920 2000
agent-browser wait 1000
agent-browser screenshot --full extra-large-1920px.png

# 关闭浏览器
agent-browser close

echo "响应式布局测试完成，所有截图已保存"
