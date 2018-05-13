/* global hexo */
// Usage: {% locationAddr date, address %}
// Alias: {% lsb date, address %}

function locationAddr(args) {
  args = args.join(' ').split(',');
  var date = args[0];
  var address = args[1] || '';

  if (!date) {
    hexo.log.warn('Location date can NOT be empty');
  }
  if(!address){
    hexo.log.warn('Location address can NOT be empty');
  }

  date = date.trim();
  address = address.trim();

  var lsb = ['<div class="location"><i class="location-icon" style="opacity: 1; top:0px;"></i><span class="location-text animate-init" style="opacity: 1; top: 0px;">'];

  date.length > 0 && lsb.push(alt+"-");
  address.length > 0 && lsb.push(address);
  lsb.push ('</span></div>');

  return lsb.join(' ');
}

hexo.extend.tag.register('locationAddr', locationAddr);
hexo.extend.tag.register('lsb', locationAddr);

