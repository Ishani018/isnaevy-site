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
(function(){
  var v=document.querySelector('[data-eleven-video]'),btn=document.querySelector('[data-eleven-toggle]');
  if(!v||!btn)return;
  var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)'),userPaused=!!(rm&&rm.matches),inView=false;
  function sync(){var p=v.paused;btn.setAttribute('data-state',p?'paused':'playing');btn.setAttribute('aria-label',p?'Play preview':'Pause preview')}
  function play(){var r=v.play();if(r&&r.catch)r.catch(function(){sync()})}
  function update(){if(inView&&!userPaused)play();else v.pause()}
  v.addEventListener('play',sync);v.addEventListener('pause',sync);
  btn.hidden=false;sync();
  btn.addEventListener('click',function(){userPaused=!v.paused;if(userPaused)v.pause();else play()});
  if('IntersectionObserver' in window){new IntersectionObserver(function(e){inView=e[0].isIntersecting;update()},{threshold:.35}).observe(v)}else{inView=true;update()}
})();

/* Theme Picker: Lavender, Baby Blue, Baby Pink, Baby Green */
(function(){
  var STORAGE_KEY='isnaevy-theme';
  var root=document.documentElement;
  var pickers=document.querySelectorAll('[data-theme-picker]');
  if(!pickers.length)return;

  function getStoredTheme(){
    try{return localStorage.getItem(STORAGE_KEY)||'purple'}catch(e){return 'purple'}
  }

  function applyTheme(theme){
    if(theme==='purple'){
      root.removeAttribute('data-theme');
    }else{
      root.setAttribute('data-theme',theme);
    }
    try{localStorage.setItem(STORAGE_KEY,theme)}catch(e){}
    syncUI(theme);
  }

  function syncUI(theme){
    var labels={purple:'Purple',blue:'Blue',pink:'Pink',green:'Green'};
    pickers.forEach(function(picker){
      var btn=picker.querySelector('.theme-toggle-btn');
      var options=picker.querySelectorAll('[data-theme-value]');
      if(btn){
        btn.setAttribute('aria-label','Theme palette: '+(labels[theme]||'Purple'));
      }
      options.forEach(function(opt){
        var val=opt.getAttribute('data-theme-value');
        var isActive=val===theme;
        opt.classList.toggle('active',isActive);
        opt.setAttribute('aria-selected',isActive?'true':'false');
      });
    });
  }

  var currentTheme=getStoredTheme();
  applyTheme(currentTheme);

  pickers.forEach(function(picker){
    var btn=picker.querySelector('.theme-toggle-btn');
    var menu=picker.querySelector('.theme-dropdown');
    if(!btn||!menu)return;

    function openMenu(){
      menu.hidden=false;
      btn.setAttribute('aria-expanded','true');
    }
    function closeMenu(){
      menu.hidden=true;
      btn.setAttribute('aria-expanded','false');
    }

    btn.addEventListener('click',function(e){
      e.stopPropagation();
      if(menu.hidden)openMenu();else closeMenu();
    });

    picker.querySelectorAll('[data-theme-value]').forEach(function(opt){
      opt.addEventListener('click',function(e){
        e.stopPropagation();
        var selected=opt.getAttribute('data-theme-value');
        applyTheme(selected);
        closeMenu();
        btn.focus();
      });
    });

    document.addEventListener('click',function(e){
      if(!picker.contains(e.target))closeMenu();
    });

    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&!menu.hidden){
        closeMenu();
        btn.focus();
      }
    });
  });
})();


/* Scroll reveal for elements marked .reveal (currently just the
   homepage content sections). No-ops everywhere else. */
(function(){
  var els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  if(!('IntersectionObserver' in window) || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
    els.forEach(function(el){ el.classList.add('is-visible') });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function(el){ io.observe(el) });
})();
