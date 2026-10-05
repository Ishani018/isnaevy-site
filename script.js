document.getElementById('year').textContent = new Date().getFullYear();
document.querySelectorAll('[data-carousel]').forEach(function(c){
  var track=c.querySelector('.carousel-track'),n=track.children.length,dots=c.querySelector('.carousel-dots'),i=0,timer,startX=null;
  for(var k=0;k<n;k++){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Go to screenshot '+(k+1));(function(k){b.onclick=function(){go(k);restart()}})(k);dots.appendChild(b)}
  function go(x){i=(x+n)%n;track.style.transform='translateX(-'+i*100+'%)';[].forEach.call(dots.children,function(d,j){d.classList.toggle('active',j===i)})}
  function restart(){clearInterval(timer);timer=setInterval(function(){go(i+1)},5000)}
  c.querySelector('.prev').onclick=function(){go(i-1);restart()};
  c.querySelector('.next').onclick=function(){go(i+1);restart()};
  c.addEventListener('touchstart',function(e){startX=e.touches[0].clientX},{passive:true});
  c.addEventListener('touchend',function(e){if(startX===null)return;var d=e.changedTouches[0].clientX-startX;if(Math.abs(d)>40){go(i+(d<0?1:-1));restart()}startX=null});
  go(0);restart();
});
