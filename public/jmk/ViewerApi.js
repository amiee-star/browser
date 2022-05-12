/**
 * Created by Kai on 2021/2/14.
 */

export class ViewerApi extends THREE.EventDispatcher {

    constructor() {
        super()
    }

    // 跳转到观察对象
    seeItem(object){
        console.assert(!1, "implement not found")
    }

    // 获取可编辑材质对象
    getEditableMaterials() {
        console.assert(!1, "implement not found")
    }

    // 获取可编辑节点对象类型
    getEditableNodeTypes() {
        console.assert(!1, "implement not found")
    }

    // 查找材质对象
    findMaterial() {
        console.assert(!1, "implement not found")
    }

    // 查找Mesh对象
    findMeshesWithMaterial() {
        console.assert(!1, "implement not found")
    }

    // 查找节点对象
    findNodesOfType() {
        console.assert(!1, "implement not found")
    }

    // 获取相机位置对象
    getCameraPosition() {
        console.assert(!1, "implement not found")
    }

    // 获取相机旋转对象
    getCameraRotation() {
        console.assert(!1, "implement not found")
    }

    // 获取场景包围盒
    getSceneBoundingBox() {
        console.assert(!1, "implement not found")
    }

    // 设置节点对象材质
    setMaterialForNode(node, material) {
        console.assert(!1, "implement not found")
    }

    // 设置Mesh对象材质
    setMaterialForMesh(mesh, material) {
        console.assert(!1, "implement not found")
    }

    // 切换视角
    switchToView(name, time, isTop) {
        console.assert(!1, "implement not found")
    }

    // 截图
    // config : {
    //  isPanorama,
    //  width,
    //  height,
    //  toDataUrl
    // }
    captureImage(config) {
        console.assert(!1, "implement not found")
    }

    // 加载全部素材
    loadAssets(extobj){
        console.assert(!1, "implement not found")
    }

    // 添加Anchor（热点）
    addAnchor(config, onAnchorClick) {
        console.assert(!1, "implement not found")
    }

    // 移除Anchor（热点）
    removeAnchor(anchor) {
        console.assert(!1, "implement not found")
    }

    // 添加化身人
    addAvatar(uuid, config) {
        console.assert(!1, "implement not found")
    }

    // 移除化身人
    removeAvatar(avatar) {
        console.assert(!1, "implement not found")
    }

    // 查找化身人
    findAvatar(avatar) {
        console.assert(!1, "implement not found")
    }

    // 暂停材质动画
    sleepAnimatedMaterials() {
        console.assert(!1, "implement not found")
    }

    // 唤醒材质动画
    wakeAnimatedMaterials() {
        console.assert(!1, "implement not found")
    }

    // 打开材质替换窗口（废弃）
    openMaterialPicker(a, b, c, d){
        console.assert(!1, "implement not found")
    }

    // 移除Anchor可见列表
    removeAnchorsVisibilityChangedListener(a) {
        console.assert(!1, "implement not found")
    }

    // 打开网页
    openUrl(url, newWindow){
        console.assert(!1, "implement not found")
    }

    // 页面第一次交互回调
    onPageFirstInteraction(callback){
        console.assert(!1, "implement not found")
    }

    // ViewerConfig加载回调
    onViewerConfigLoaded(callback){
        console.assert(!1, "implement not found")
    }

    // 场景是否可以显示
    isSceneReadyToDisplay(callback){
        console.assert(!1, "implement not found")
    }

    // 场景可显示回调
    onSceneReadyToDisplay(callback){
        console.assert(!1, "implement not found")
    }

    // 场景加载完毕回调
    onSceneLoadComplete(callback){
        console.assert(!1, "implement not found")
    }

    // 强刷一帧
    requestFrame(){
        console.assert(!1, "implement not found")
    }

    // 设置节点可编辑回调
    setNodeTypeEditable(callback){
        console.assert(!1, "implement not found")
    }

    // 设置材质可编辑回调
    setMaterialEditable(callback) {
        console.assert(!1, "implement not found")
    }

    // 设置全体材质可编辑
    setAllMaterialsEditable(){
        console.assert(!1, "implement not found")
    }

    // 添加节点点击事件
    onNodeTypeClicked(a, b) {
        console.assert(!1, "implement not found")
    }

    // 移除节点点击事件
    removeOnNodeTypeClicked(a, b) {
        console.assert(!1, "implement not found")
    }

    // 添加材质点击事件
    onMaterialClicked(material, callback){
        console.assert(!1, "implement not found")
    }

    // 添加材质悬停事件
    onMaterialHoverChanged(material, callback){
        console.assert(!1, "implement not found")
    }

    // 添加视口开始切换事件
    onViewSwitchStarted(callback){
        console.assert(!1, "implement not found")
    }

    // 添加视口开始完成事件
    onViewSwitchDone(callback){
        console.assert(!1, "implement not found")
    }

    // 添加VR模式切换事件
    onVrChange(callback){
        console.assert(!1, "implement not found")
    }

    // 添加渲染前事件
    onBeforeRender(callback){
        console.assert(!1, "implement not found")
    }

    // 用HTML Image对象创建纹理
    createTextureFromHtmlImage(image) {
        console.assert(!1, "implement not found")
    }

    // 用HTML Video对象创建纹理
    createTextureFromHtmlVideo(video){
        console.assert(!1, "implement not found")
    }

    // 添加热点可见性监听事件
    onAnchorsVisibilityChanged(callback){

    }

    // 移除热点可见性监听事件
    removeAnchorsVisibilityChangedListener(callback){
        console.assert(!1, "implement not found")
    }

    // 获取场景路径
    getViewerAssetUrl(a) {
        console.assert(!1, "implement not found")
    }

    // 获取所有View(预设相机位)
    getViews(){
        console.assert(!1, "implement not found")
    }

    // 获取所有导览路径
    getTours() {
        console.assert(!1, "implement not found")
    }

    // 获取自动导览对象
    getAutoTour() {
        console.assert(!1, "implement not found")
    }

    // 添加菜单按钮
    addMenuButton(a) {
        console.assert(!1, "implement not found")
    }

    // 移除菜单按钮
    removeMenuButton(a) {
        console.assert(!1, "implement not found")
    }

    // 获取菜单按钮Icon
    getMenuButtonIcon(a) {
        console.assert(!1, "implement not found")
    }

    // 菜单可见变化响应函数
    onMenuVisibilityChanged(a) {
        console.assert(!1, "implement not found")
    }

    // 播放场景（废弃）
    play() {
        console.assert(!1, "implement not found")
    }

    // 暂停场景（废弃）
    pause() {
        console.assert(!1, "implement not found")
    }

    // Api用户状态改变
    apiUserChangeState(a, b) {
        console.assert(!1, "implement not found")
    }

    // 移除Api用户状态改变监听
    removeOnApiUserStateChanged(a, b) {
        console.assert(!1, "implement not found")
    }

    // 获取Api用户状态
    getApiUserState(a) {
        console.assert(!1, "implement not found")
    }

    // 添加化身人列表改变监听事件
    onAvatarListChanged(callback){
        console.assert(!1, "implement not found")
    }

    // 移除化身人列表改变监听事件
    removeOnAvatarListChanged(callback){
        console.assert(!1, "implement not found")
    }

    // 禁用组件
    disableControls() {
        console.assert(!1, "implement not found")
    }

    // 启用组件
    enableControls() {
        console.assert(!1, "implement not found")
    }

    // 碰撞检测
    findIntersectionAtPosition(x, y) {

    }
}