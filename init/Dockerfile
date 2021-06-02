FROM node:latest

LABEL maintainer="Qing Song 1962009798@qq.com"

# 设置时区
RUN apk --update add tzdata \
  && cp /usr/share/zoneinfo/Asia/shanghai /etc/localtime \
  && echo "Asia/Shanghai" > /etc/timezone \
  && apk del tzdata

# 创建app目录, 每次的RUN命令都会产生一个新的镜像，每次执行都会回到根目录下
RUN mkdir -p /usr/src/node-app/egg-santak

# 设置工作目录 WORKDIR是cd的作用
WORKDIR /usr/src/node-app/egg-santak

# 拷贝package.json文件到工作目录
# !!重要：package.json需要单独添加。
# Docker在构建镜像的时候，是一层一层构建的，仅当这一层有变化时，重新构建对应的层。
# 如果package.json和源代码一起添加到镜像，则每次修改源码都需要重新安装npm模块，这样木有必要。
# 所以，正确的顺序是: 添加package.json；安装npm模块；添加源代码。
# docker build [选项] <上下文路径/URL/->
# COPY的package.json是上下文路径中的package.json
COPY package.json /usr/src/node-app/egg-santak/package.json


# 安装依赖
RUN npm i -g yarn && yarn install

# 暴露容器端口
EXPOSE 7001

# 启动node应用
CMD npm start