#!/bin/bash

# 创建截图保存目录
mkdir -p screenshots/{mobile,tablet,desktop,large-desktop,extra-large}

# 定义测试的屏幕尺寸
sizes=("375 812 mobile" "768 1024 tablet" "1024 1440 desktop" "1440 2000 large-desktop" "1920 2000 extra-large")

# 打开网站
agent-browser open http://localhost:4327/

# 等待页面加载完成
if agent-browser wait --load networkidle; then
  echo "页面加载完成"
else
  echo "等待页面加载超时，继续执行"
fi

# 测试每个屏幕尺寸
for size in "${sizes[@]}"; do
  set -- $size
  width=$1
  height=$2
  device=$3
  
  echo "测试 $device 尺寸: ${width}px x ${height}px"
  
  # 设置视口尺寸
  agent-browser set viewport $width $height
  
  # 等待页面适应新的视口
  agent-browser wait 1000
  
  # 截取完整页面截图
  agent-browser screenshot --full --screenshot-dir screenshots/$device --screenshot-name ${width}px.png
  
  echo "截图已保存到 screenshots/$device/${width}px.png"
done

# 关闭浏览器
agent-browser close

echo "响应式布局测试完成，所有截图已保存"
