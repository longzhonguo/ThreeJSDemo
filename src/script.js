import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 1. 引入图片
import floor from "./images/floor_wood.jpeg";
// 立方体的顶部纹理
import grass_top from "./images/grass_top.jpg";
// 立方体的侧边纹理
import grass_side from "./images/grass_side.jpg";
// 立方体的底部纹理
import grass_bottom from "./images/grass_bottom.jpg";
// 参考页面：https://juejin.cn/post/7343621601134559232

/**
 * 1. 创建渲染器,指定渲染的分辨率和尺寸,然后添加到body中
 * 2. 创建场景
 * 3. 创建相机
 * 4. 创建物体
 * 5. 渲染
 */
// 1. 创建渲染器,指定渲染的分辨率和尺寸,然后添加到body中
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.pixelRatio = window.devicePixelRatio;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

// 2. 创建场景
const scene = new THREE.Scene();

// 3. 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(5, 5, 10); // 移动相机位置
camera.lookAt(0, 0, 0); // 设置相机看向原点的方向

// 4. 创建坐标系
const axis = new THREE.AxesHelper(5);
scene.add(axis);
// 当你需要隐藏坐标系时
axis.visible = false; // 设置为false即可隐藏坐标系

/**
 * 添加物体
 */
// 添加立方体
const geometry = new THREE.BoxGeometry(4, 4, 4);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // 可设置光源
// 初始化纹理加载器
const textloader = new THREE.TextureLoader();
// 添加立方体纹理
const material = [
  new THREE.MeshBasicMaterial({
    map: textloader.load(grass_side),
  }),
  new THREE.MeshBasicMaterial({
    map: textloader.load(grass_side),
  }),
  new THREE.MeshBasicMaterial({
    map: textloader.load(grass_top),
  }),
  new THREE.MeshBasicMaterial({
    map: textloader.load(grass_bottom),
  }),
  new THREE.MeshBasicMaterial({
    map: textloader.load(grass_side),
  }),
  new THREE.MeshBasicMaterial({
    map: textloader.load(grass_side),
  }),
];
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 5. 渲染
renderer.render(scene, camera);

/**
 * 物体动画
 */
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime(); // 返回已经过去的时间, 以秒为单位
  cube.rotation.y = elapsedTime * Math.PI; // 两秒自转一圈

  renderer.render(scene, camera);
}
animate();

/**
 * 添加交互
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

/**
 * 添加光源
 * 环境光（Ambient Light）：环境光是一种均匀的光照，它会均匀地照亮场景中的所有物体，不考虑光照源的位置和方向。
 * 方向光（Directional Light）：方向光是一种平行光源，它具有确定的方向和强度，类似于太阳光。
 * 点光源（Point Light）：点光源是一种位于特定位置的光源，它向所有方向发射光线，类似于灯泡。
 */
// 2. 创建环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// 3. 创建方向光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-5, 3, -10); // 光源位置
scene.add(directionalLight);

/**
 * 添加阴影
 * 1. 将渲染器的shadowMap.enabled设置为true, 表示渲染器能够渲染阴影效果;
 * 2. directionalLight.castShadow = true，表示该方向会投射阴影效果；
 * 3. cube.castShadow = true, 表示该立方体会产生影像效果；
 * 4. 新建了一个平面，该平面能够接受投射过来的阴影效果；
 * 5. 为了清晰展示方向光的方向和位置，添加了一个辅助线。
 */
// 1. 渲染器能够渲染阴影效果
renderer.shadowMap.enabled = true;

// 2. 该方向会投射阴影效果
directionalLight.castShadow = true;

// 3.
cube.castShadow = true;

// 4.
const planeGeometry = new THREE.PlaneGeometry(20, 20);

/**
 * 设置底板纹理
 */
// 给底板加载纹理
const planeMaterial = new THREE.MeshStandardMaterial({
  map: textloader.load(floor),
});
// const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // 纯色底板，无纹理
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -0.5 * Math.PI;
planeMesh.position.set(0, -3, 0); // 底板平面位置
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// // 5. 方向光的辅助线
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight
// );
// scene.add(directionalLightHelper); // 辅助线
