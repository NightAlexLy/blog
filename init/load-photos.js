/* global hexo */
// Usage: {% loadPhotos [{src:'',title:''}] %}
// Alias: {% lps [{src:'',title:''}] %}

function loadPhotos(args) {
  var photos = args;

  if (!photos) {
    hexo.log.warn('Photos can NOT be empty');
  }
  
  var json = eval('(' + photos + ')');
  
  var context = [''];
  for(var i in json){
	var obj = json[i];
	context.push('<figure class="gallery-item" style="margin:0px;"><img src="');
	context.push(obj["src"]);
	context.push('" alt="');
	context.push(obj["title"]);
	context.push('"  style="margin: auto;padding: initial;border: none;box-sizing: initial;"><figcaption>');
	context.push(obj["title"]);
	context.push('</figcaption></figure>');
  }

  return context.join(' ');
}

hexo.extend.tag.register('loadPhotos', loadPhotos);
hexo.extend.tag.register('lps', loadPhotos);
