function addScript(url) {
  // 选择所有的<script>元素
  var scripts = document.querySelectorAll('script[src^="/thingview"]');
  // 循环遍历并删除它们
  for (var i = scripts.length - 1; i >= 0; i--) {
    var script = scripts[i];
    script.parentNode.removeChild(script);
  }
  return new Promise((resolve) => {
    const scriptInfo = document.createElement('script')
    scriptInfo.type = 'text/javascript'
    scriptInfo.src = url
    document.body.appendChild(scriptInfo)
    scriptInfo.onload = scriptInfo.onreadystatechange = function () {
      if (
        !this.readyState
        || this.readyState === 'loaded'
        || this.readyState === 'complete'
      ) {
        scriptInfo.onload = scriptInfo.onreadystatechange = null
        // 保证js加载完成后,将结果传递出去
        resolve()
      }
    }
  })
}
export default addScript
