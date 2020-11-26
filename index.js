window.PIXI   = require('phaser-ce/build/custom/pixi')
window.p2     = require('phaser-ce/build/custom/p2')
window.Phaser = require('phaser-ce/build/custom/phaser-split')

import 'promise-polyfill/src/polyfill'
import 'whatwg-fetch'
import '/src/js/utils/jquery-1.7.1.min.js'
import {setCookie, getCookie} from '/src/js/utils/simpleCookies.js'
import questions from '/src/js/service/questions.js'
import {saveAward, checkPermission, checkLogin} from '/src/js/service/coin.js'
import iconUrl from '/src/assets/icon.png'
import icon1111Url from '/src/assets/icon_1111.png'

// import hammer from '/src/assets/hammer.png'

// import Gray from '/src/js/filters/gray.js'
// console.log(iconUrl)
// console.log(hammer)
const
  DEFAULT_FONT = 'Microsoft JhengHei',
  MAX_WIDTH = 640,
  MAX_HEIGHT = 820,
  IS_MOBILE = checkMobile(),
  API_EXCUTE = true,
  COIN_PAGE_URL = 'https://point.ruten.com.tw/coin/detail.php'


class Gray extends Phaser.Filter {
  constructor(game) {
    super(game);
    this.uniforms.gray = { type: '1f', value: 1.0 };
    this.fragmentSrc = [
      "precision mediump float;",

      "varying vec2       vTextureCoord;",
      "varying vec4       vColor;",
      "uniform sampler2D  uSampler;",
      "uniform float      gray;",

      "void main(void) {",
      "gl_FragColor = texture2D(uSampler, vTextureCoord);",
      "gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126 * gl_FragColor.r + 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b), gray);",
      "}"
    ];
  }

  set gray(value) {
    this.uniforms.gray.value = value;
  }

  get gray() {
    return this.uniforms.gray.value;
  }
}

function checkMobile() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function checkOffline() {
  // return sharonGetDate() > 20181111
  return false
}

function checkDoubleEleventDay() {
  var nowDate = sharonGetDate();
  return 20181111 <= nowDate && nowDate < 20181112
}

function sharonGetDate() {
  let today = new Date()
  let month = today.getMonth() + 1
  let day = today.getDate()
  return Number(today.getFullYear() + ((month > 9 ? '' : '0') + month) + ((day > 9 ? '' : '0') + day))
}

window.onload = function() {
  const
    sideM = document.querySelector('.side-mobile'),
    sidePC = document.querySelector('.side-pc'),
    main = document.querySelector('.main'),
    icons = document.querySelectorAll('.icon img')

  Array.from(icons).forEach(icon => icon.src = checkDoubleEleventDay() ? icon1111Url : iconUrl)

  if(!IS_MOBILE) {
    sidePC.style.display = 'block'
  } else {
    sideM.style.display = 'block'

    // window.ontouchmove = function() {return false}
    // window.onscroll = function() {return false}
    // $(window).bind(
    //   'touchmove',
    //    function(e) {
    //     e.preventDefault();
    //   }
    // );

    // let vh = window.innerHeight * 0.01;
    // document.documentElement.style.setProperty('--vh', `${vh}px`);

    // document.body.position = 'fixed'
    // document.documentElement.position = 'fixed'

    main.style.height = `${window.innerHeight}px`

    // document.ontouchmove = function (e) {
    //   e.preventDefault();
    // }
    // document.touchstart = function (e) {
    //   e.preventDefault();
    // }

    // main.ontouchmove = function (e) {
    //   e.preventDefault();
    // }
    // main.touchstart = function (e) {
    //   e.preventDefault();
    // }
  }
}
// const Presets = {
//   'width': window.innerWidth > 640 ? 640 : window.innerWidth,
//   'height': window.innerHeight > 820 ? 820 : window.innerHeight
// }
// var configuration = {
//   'canvas_width_max' : 640,
//   'canvas_width' : 640,
//   'canvas_height_max' : 820,
//   'canvas_height' : 820,
//   'scale_ratio' : 1,
//   'aspect_ratio' : 1,
// };

let configuration = {
  width: 640,
  height: 820
}

if(window.innerWidth < 640 || window.innerHeight < 820) {
  // configuration.height = window.innerHeight

  // configuration.canvas_width = window.screen.availWidth * window.devicePixelRatio;
  // configuration.canvas_height = window.screen.availHeight * window.devicePixelRatio;
  // configuration.aspect_ratio = configuration.canvas_width / configuration.canvas_height;
  // if (configuration.aspect_ratio < 1) configuration.scale_ratio = configuration.canvas_height / configuration.canvas_height_max;
  // else configuration.scale_ratio = configuration.canvas_width / configuration.canvas_width_max;
}

const game = new Phaser.Game(MAX_WIDTH, MAX_HEIGHT, Phaser.AUTO, 'game')
let isPlayed = {
  lightSword: true,
  hammer: true,
  branch: true,
  lotion: true
}
const dudeMap = {
  'thunder': {
    weapon: 'hammer',
    backgroundColor: '#1b1848'
  },
  'white_soldier': {
    weapon: 'lightSword',
    backgroundColor: '#1f0820'
  },
  'princess': {
    weapon: 'lotion',
    backgroundColor: '#6a8437'
  },
  'harry': {
    weapon: 'branch',
    backgroundColor: '#021423'
  }
}

const gameMap = {
  'thunder': 'GAME_1',
  'white_soldier': 'GAME_2',
  'princess': 'GAME_3',
  'harry': 'GAME_4'
}


let profile = {
  userNick: null,
  rid: null
}

function slash() {
  this.preload = function() {
    // this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.input.touch.preventDefault = true;

    // let h = this.scale.game.canvas.parentElement.offsetHeight;
    // let scaleY = h / this.scale.game.height;
    // this.scale.setUserScale(scaleY, scaleY, 0, 0);
    // this.scale.setGameSize(375, 667);

    // this.scale.minWidth = 320;
    // this.scale.minHeight = 480;
    this.scale.maxWidth = MAX_WIDTH
    this.scale.maxHeight = MAX_HEIGHT

    this.load.image('loading_fiture', '/src/assets/loading_fiture.png')
    this.load.image('loading_icon', '/src/assets/loading_icon.png')
    this.load.image('cloud', '/src/assets/cloud.png');
    this.load.image('cloud2', '/src/assets/cloud2.png');
    console.log(this.load.image)
  }
  this.create = function() {
    this.stage.backgroundColor = '#8adbff'

    let loadingFiture = game.add.sprite(game.world.centerX, game.world.centerY - 180, 'loading_fiture')
    loadingFiture.anchor.set(0.5)
    loadingFiture.scale.set(0.5)

    let loadingIcon = game.add.sprite(game.world.centerX, game.world.centerY + 220, 'loading_icon')
    loadingIcon.anchor.set(0.5)
    loadingIcon.scale.set(0.5)

    let cloud = game.add.sprite(50, game.world.centerY - 350, 'cloud')
    cloud.anchor.set(0.5)
    cloud.scale.set(0.2, 0.25)

    let cloud2 = game.add.sprite(50, game.world.centerY + 270, 'cloud2')
    cloud2.anchor.set(0.5)
    cloud2.scale.set(0.2, 0.25)

    let cloud3 = game.add.sprite(game.stage.width - 70, game.world.centerY + 30, 'cloud2')
    cloud3.anchor.set(0.5)
    cloud3.scale.set(0.2, 0.25)

    game.state.start('init', false, false)
  }
}

function init() {
  let
    text,
    isDeadline = false

  this.preload = function () {
    // this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
    // this.scale.pageAlignHorizontally = true;
    // this.scale.pageAlignVertically = true;

    // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL


    // let h = this.scale.game.canvas.parentElement.offsetHeight;
    // let scaleY = h / this.scale.game.height;
    // this.scale.setUserScale(scaleY, scaleY, 0, 0);
    // this.scale.setGameSize(375, 667);

    // this.scale.minWidth = 320;
    // this.scale.minHeight = 480;
    // this.scale.maxWidth = MAX_WIDTH
    // this.scale.maxHeight = MAX_HEIGHT

    // this.scale.scaleMode = Phaser.ScaleManager.RESIZE
    // this.scale.forceOrientation(!1, !0)
    // this.scale.setUserScale(0.5, 0.5);

    // a.onSizeChange.add(this.onSizeChange, this)


    // game.canvas.style.width = '100%';
    // game.canvas.style.height = '100%';
    // game.scale.refresh();

    // this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    // this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
    // this.input.touch.preventDefault = false;

    // this.stage.backgroundColor = '#182d3b';
    this.load.image('button', '/src/assets/game_btn.png');
    this.load.image('title', '/src/assets/title.png');
    this.load.image('island', '/src/assets/island.png');
    this.load.image('coffee', '/src/assets/coffee.png');
    this.load.image('harry', '/src/assets/harry.png');
    this.load.image('princess', '/src/assets/princess.png');
    this.load.image('thunder', '/src/assets/thunder.png');
    this.load.image('white_soldier', '/src/assets/white_soldier.png');
    this.load.image('harry_bg', '/src/assets/harry_bg.png');
    this.load.image('princess_bg', '/src/assets/princess_bg.png');
    this.load.image('thunder_bg', '/src/assets/thunder_bg.png');
    this.load.image('white_soldier_bg', '/src/assets/white_soldier_bg.png');
    this.load.image('branch', '/src/assets/branch.png');
    this.load.image('lotion', '/src/assets/lotion.png');
    this.load.image('hammer', '/src/assets/hammer.png');
    this.load.image('light_sword', '/src/assets/light_sword.png');
    this.load.image('bn6', '/src/assets/bn6.png');
    this.load.image('bn7', '/src/assets/bn7.png');
    this.load.image('ticket1', '/src/assets/ticket1.png');
    this.load.image('ticket2', '/src/assets/ticket2.png');
    this.load.image('ticket3', '/src/assets/ticket3.png');
    this.load.image('ticket4', '/src/assets/ticket4.png');
    this.load.image('ticket5', '/src/assets/ticket5.png');
    this.load.image('close_btn', '/src/assets/close_btn.png');
    this.load.image('paper', '/src/assets/paper.png');

    // text = game.add.text(32, 32, 'Click to start load', { fill: '#ffffff' });
    this.load.onLoadStart.add(loadStart, this);
    this.load.onFileComplete.add(fileComplete, this);
    // this.load.onLoadComplete.add(loadComplete, this);
    this.load.onLoadComplete.add(() => setTimeout(loadComplete, 500), this);

  }

  function loadStart() {
    // text.setText("Loading ...");
    setTimeout(() => {isDeadline = true}, 2000);
  }

  //	This callback is sent the following parameters:
  function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    // text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
  }

  function loadComplete() {
    if (isDeadline) {
      // text.setText("Load Complete");

      game.state.start('home')

      let randomList = [
        '今天已經玩過囉！明天再來吧',
        '掰掰！明天見',
        '眼睛該休息囉！明天再來吧',
        '今日任務已達上限'
      ]

      API_EXCUTE &&
      // false &&
      checkLogin()
        .then(res => {
          profile.userNick = res.userNick
          profile.rid = getCookie('bid_rid')

          const list = [
            checkPermission(profile.userNick, 'GAME_1'),
            checkPermission(profile.userNick, 'GAME_2'),
            checkPermission(profile.userNick, 'GAME_3'),
            checkPermission(profile.userNick, 'GAME_4')
          ]

          Promise.all(list)
            .then(res => {
              isPlayed = {
                hammer: !res[0].available,
                lightSword: !res[1].available,
                lotion: !res[2].available,
                branch: !res[3].available
              }

              game.state.start('home')

              ;[
                !res[0].available,
                !res[1].available,
                !res[2].available,
                !res[3].available
              ].every(isPlayed => isPlayed) && alert(randomList[game.rnd.between(0, 3)])

            })
            .catch(() => alert(randomList[game.rnd.between(0, 3)]))
        })
        .catch(() => {})

    } else {
      setTimeout(loadComplete, 500)
    }
  }
}

function home() {
  let
    weapon = null,
    clouds = null,
    cloudsFront = null,
    weaponList = null

  this.create = function() {
    document.getElementsByTagName('body')[0].style.backgroundColor = '#333'
    if(IS_MOBILE) document.getElementsByTagName('body')[0].classList.add('liner-background')
    this.stage.backgroundColor = '#8adbff'

    clouds = game.add.physicsGroup()

    for (let i = 0; i < 5; i+=1) {
      let cloudType = ['cloud', 'cloud2']
      let cloud = clouds.create(game.world.randomX, _cloudPosY(), cloudType[game.rnd.between(0, 1)])
      cloud.anchor.set(0.5)
      cloud.scale.set(0.2)
      cloud.body.velocity.x = game.rnd.between(-10, -30)
    }

    // let title = game.add.sprite(game.world.centerX, -100, 'title')
    let title = game.add.sprite(game.world.centerX, 100, 'title')
    title.anchor.set(0.5)
    title.scale.set(0.3)
    // game.add.tween(title).to( { y: 100 }, 3000, Phaser.Easing.Bounce.Out, true, 1500)

    let island = game.add.sprite(game.world.centerX, game.world.centerY - 50, 'island')
    island.anchor.set(0.5)
    island.scale.set(0.28)
    game.add.tween(island).to( { y: island.y - 15 }, 2000, Phaser.Easing.Linear.None, true, 0 ,-1 , true)

    let coffee = game.add.sprite(game.world.centerX - 20, 750, 'coffee')
    coffee.anchor.set(0.5)
    coffee.scale.set(0.4)

    let lightSword = game.add.button(game.world.centerX + 150, 170 + game.world.centerY, 'light_sword', ()=>{}, this, 2, 1, 0)
    lightSword.isPlayed = isPlayed.lightSword
    lightSword.dude = 'white_soldier'
    let hammer = game.add.button(game.world.centerX - 150, 170 + game.world.centerY, 'hammer', ()=>{}, this, 2, 1, 0);
    hammer.isPlayed = isPlayed.hammer
    hammer.dude = 'thunder'
    let branch = game.add.button(game.world.centerX + 150, 170 + game.world.centerY + 160, 'branch', ()=>{}, this, 2, 1, 0);
    branch.isPlayed = isPlayed.branch
    branch.dude = 'harry'
    let lotion = game.add.button(game.world.centerX - 150, 170 + game.world.centerY + 160, 'lotion', ()=>{}, this, 2, 1, 0);
    lotion.isPlayed = isPlayed.lotion
    lotion.dude = 'princess'


    weaponList = [lightSword, hammer, branch, lotion]

    weaponList.forEach(weapon => {
      weapon.anchor.set(0.5)
      weapon.scale.set(0.25)
      // weapon.onInputOver.add(function(target){
      //   target.scale.set(0.3)
      // }, this)
      // weapon.onInputOut.add(function(target){
      //   target.scale.set(0.25)
      // }, this)

      // game.time.events.loop(3500 + rndTime, ()=> {
      //   game.add.tween(weapon).to( { y: weapon.y + 15 }, 100, Phaser.Easing.Linear.None, true)
      // })

      weapon.onInputDown.add(function(target){
        target.scale.set(0.235)
      }, this)

      if(weapon.isPlayed) {
        this.filterGray = new Gray(this.game)
        weapon.filters = [this.filterGray]
        weapon.onInputUp.add(function(target) {
          target.scale.set(0.25)
          alert('本日已領過彩票囉！快去其他關卡挑戰拿彩票吧～')
        })
      } else {

        game.time.events.loop(3000 + game.rnd.between(0, 3000), ()=> {
          let tween = game.add.tween(weapon).to( { y: weapon.y - 15 }, 500, Phaser.Easing.Bounce.Out, true)
          tween.onComplete.add(function(target) {
            game.add.tween(target).to( { y: target.y + 15 }, 100, Phaser.Easing.Linear.None, true)
          })
        })

        weapon.onInputUp.add(function(target) {
          target.scale.set(0.25)
          game.state.start('play', true, false, weapon.dude)
        })


      }
    })

    cloudsFront = game.add.physicsGroup()

    for (let i = 0; i < 3; i+=1) {
      let cloudType = ['cloud', 'cloud2']
      let cloud = cloudsFront.create(game.world.randomX, _cloudFrontPosY(), cloudType[game.rnd.between(0, 1)])
      cloud.anchor.set(0.5)
      cloud.scale.set(0.18)
      // game.add.tween(cloud).to( { x: -100 }, game.rnd.between(10000, 12000), Phaser.Easing.Linear.None, true)
      cloud.body.velocity.x = game.rnd.between(-10, -65)
    }

    let hintPopup = {
      name: 'ticket5',
      action: null,
      label: {
        x: game.world.centerX,
        y: game.world.centerY - 100,
        text: '歡迎來到『露天覓寶樂園』\n只要通過挑戰，\n就可以獲得彩票。\n請選擇一個裝備開始闖關',
        style: { font: 'bold 20pt ' + DEFAULT_FONT },
        config: { lineSpacing: 10 }
      }
    }
    // game.time.events.add(5000, ()=> { showPopup(hintPopup) })
    showPopup(hintPopup)
  }

  this.update = function() {
    clouds.forEach((cloud) => {
      if(cloud.x < -100) {
        cloud.x = game.world.width + 100
        cloud.y = _cloudPosY()
      }
    }, this)
    cloudsFront.forEach((cloud) => {
      if(cloud.x < -100) {
        cloud.x = game.world.width + 100
        cloud.y = _cloudFrontPosY()
      }
    }, this)
  }

  this.render = function() {
  }

  function _cloudPosY() {
    let y = game.world.randomY
    return y > 450 ? _cloudPosY() : y
  }
  function _cloudFrontPosY() {
    let y = game.world.randomY
    return (y > 450 || y < 200) ? _cloudFrontPosY() : y
  }
}

function play() {
  let
    question,
    paper,
    spriteDude,
    anser = null,
    storyStep = 0,
    buttonList = [],
    optionTextList = [],
    dude = null,
    story,
    response = null,
    watchTimer = null,
    watchData = {
      isAnimateComplete: false,
      isAjaxComplete: false
    }

  this.init = function(userChooseDude) {
    dude = userChooseDude
    if(IS_MOBILE) document.getElementsByTagName('body')[0].classList.remove('liner-background')
    document.getElementsByTagName('body')[0].style.backgroundColor = dudeMap[dude].backgroundColor
    story = questions[dudeMap[dude].weapon].sort(() => 0.5 - Math.random()).slice(0, 4)
  }
  this.create = function() {
    let bg = this.add.image(0, 0, dude + '_bg')
    bg.scale.x = 0.6
    bg.scale.y = 0.43
    paper = this.add.image(game.world.centerX, game.world.centerY - 100, 'paper')
    paper.anchor.set(0.5)
    paper.scale.x = 0.4
    paper.scale.y = 0.35
    spriteDude = game.add.sprite(160, 620, dude)
    spriteDude.anchor.set(0.5)
    spriteDude.scale.x = 0.4
    spriteDude.scale.y = 0.4
    // spriteDude.fixedToCamera = true

    _createQuestion()

    // cursors = game.input.keyboard.createCursorKeys()
  }
  this.update = function() {
    if(anser !== null) {
      let currectAnser = story[storyStep].anser
      let userChoose = anser

      if(anser !== currectAnser) {
        // buttonList[anser].inputEnabled = false
        let action = buttonList[anser].onInputUp
        // buttonList[anser].onInputUp = null
        let buttonTween = game.add.tween(buttonList[anser]).to( { x: buttonList[anser].x - 10 }, 100, Phaser.Easing.Linear.None, true, 0 ,6 , true)
        buttonTween.onComplete.add(function(target) {
          target.onInputUp.addOnce(()=>{anser = userChoose}, this)
        }, this)
        let textTween = game.add.tween(optionTextList[anser]).to( { x: buttonList[anser].x - 10 }, 100, Phaser.Easing.Linear.None, true, 0 ,6 , true)

      } else {
        let buttonTween = game.add.tween(buttonList[anser].scale).to( { x: 3, y: 3 }, 800, Phaser.Easing.Linear.None, true);
        game.add.tween(buttonList[anser]).to( { alpha: 0.1 }, 800, Phaser.Easing.Linear.None, true)
        game.add.tween(optionTextList[anser].scale).to( { x: 3, y: 3 }, 800, Phaser.Easing.Linear.None, true)
        game.add.tween(optionTextList[anser]).to( { alpha: 0.1 }, 800, Phaser.Easing.Linear.None, true)

        buttonTween.onComplete.add(function(target) {

          buttonList.forEach(button => button.destroy())
          optionTextList.forEach(option => option.destroy())
          buttonList = []
          optionTextList = []

          storyStep += 1

          if(storyStep < story.length) {

            _createQuestion()

          } else {
            storyStep = 0
            question.destroy()
            let tweenPaper = game.add.tween(paper).to( { y: -500 }, 1800, Phaser.Easing.Linear.None, true)
            tweenPaper.onComplete.add(function(target){ target.destroy() })
            let tweenDude = game.add.tween(spriteDude).to( { x: game.world.centerX }, 2000, Phaser.Easing.Linear.None, true)
            game.add.tween(spriteDude).to( { angle: spriteDude.angle + 5 }, 200, Phaser.Easing.Linear.None, true, 0 ,10 , true)

            tweenDude.onComplete.add(function() {
              watchData.isAnimateComplete = true
            })

            API_EXCUTE &&
            saveAward({rid: getCookie('bid_rid'), type: gameMap[dude]})
              .then(res => response = res)
              .catch(error => response = error)
              .then(() => watchData.isAjaxComplete = true)

            watchTimer = setInterval(() => {
              if(watchData.isAnimateComplete && watchData.isAjaxComplete) {
                clearInterval(watchTimer)
                watchTimer = null
                watchData.isAjaxComplete = watchData.isAnimateComplete = false
                game.state.start('over', false, false, {dude, response})
              }
            }, 500)

          }
        }, this)

      }

      anser = null
    }
  }

  function _createQuestion() {
    let options = story[storyStep].options

    for (let i = 0; i < options.length; i += 1) {

      let button = game.add.button(game.world.centerX, 250 + i * 100, 'button', ()=>{}, this, 2, 1, 0)
      let optionText
      button.anchor.set(0.5)
      button.scale.set(0.85, 0.75)
      button.alpha = 0

      button.onInputOver.add(function(){
        button.scale.set(0.9, 0.8)
        optionText.scale.set(1.05)
      }, this);
      button.onInputOut.add(function(){
        button.scale.set(0.85, 0.75)
        optionText.scale.set(1, 1)
      }, this);
      // button.onInputDown.add(function(){
      //   button.scale.set(0.8, 0.7)
      //   optionText.scale.set(0.95)
      // }, this);

      // button.onInputUp.add(up, this);

      // button.inputEnabled = false

      let buttonTween = game.add.tween(button).to( { alpha: 1 }, 1600, Phaser.Easing.Linear.None, true, 1000, 0, false)
      buttonTween.onComplete.add(function(target) {
        // target.inputEnabled = true
        target.onInputUp.addOnce((target)=>{
          button.scale.set(0.85, 0.75)
          optionText.scale.set(1)
          anser = i
        }, this)
      }, this)
      buttonList.push(button)

      if(options[i].length > 9) {
        optionText = game.add.text(game.world.centerX, 250 + i * 100, filterText(options[i], 9), {font: 'bold 14pt ' + DEFAULT_FONT, fill: '#7d5c22' })
      } else {
        optionText = game.add.text(game.world.centerX, 250 + i * 100, options[i], {font: 'bold 18pt ' + DEFAULT_FONT, fill: '#7d5c22' })
      }

      optionText.anchor.set(0.5)
      optionText.alpha = 0
      game.add.tween(optionText).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 1500, 0, false)
      optionTextList.push(optionText)

    }

    if(question) question.destroy()
    question = game.add.text(game.world.centerX, 125, filterText(story[storyStep].question, 10), {font: 'bold 23pt ' + DEFAULT_FONT, fill: '#333', lineSpacing: 80 });
    question.anchor.set(0.5, 0.5)
  }
}

function over() {
  let
    overPopupList = null,
    overDude = null,
    coinAmount = 0,
    res = null

  this.init = function({dude, response}) {
    overDude = dude
    res = response

    if(res.status === 'success') {
      coinAmount = res.data.amount
    }

    overPopupList = [
      {
        name: 'ticket1',
        action: {
          x: game.world.centerX,
          y: game.world.centerY + 200,
          callback() { window.location = COIN_PAGE_URL }
        },
        label: {
          x: game.world.centerX + 75,
          y: game.world.centerY - 95,
          text: `闖關成功！\n獲得彩票${coinAmount}張！`,
          style: { font: 'bold 20pt ' + DEFAULT_FONT }
        },
        closeCallback() {
          setTimeout(() => {
            game.input.onDown.addOnce(function() {
              game.state.start('home')
            }, this)
          })
        }
      },
      {
        name: 'ticket2',
        action: {
          x: game.world.centerX,
          y: game.world.centerY + 200,
          callback() { window.location = COIN_PAGE_URL }
        },
        label: {
          x: game.world.centerX,
          y: game.world.centerY + 130,
          text: `你真是聰明絕頂～\n${coinAmount}張彩票送你！！`,
          style: { font: 'bold 20pt ' + DEFAULT_FONT }
        },
        closeCallback() {
          setTimeout(() => {
            game.input.onDown.addOnce(function() {
              game.state.start('home')
            }, this)
          })
        }
      },
      {
        name: 'ticket3',
        action: {
          x: game.world.centerX,
          y: game.world.centerY + 200,
          callback() { window.location = COIN_PAGE_URL }
        },
        label: {
          x: game.world.centerX,
          y: game.world.centerY + 110,
          text: `阿不就好棒棒！\n彩票${coinAmount}張給你`,
          style: { font: 'bold 20pt ' + DEFAULT_FONT }
        },
        closeCallback() {
          setTimeout(() => {
            game.input.onDown.addOnce(function() {
              game.state.start('home')
            }, this)
          })
        }
      },
      {
        name: 'ticket4',
        action: {
          x: game.world.centerX,
          y: game.world.centerY,
          callback() { window.location = COIN_PAGE_URL }
        },
        label: {
          x: game.world.centerX,
          y: game.world.centerY - 70,
          text: `${coinAmount}張彩票進帳囉`,
          style: { font: 'bold 24pt ' + DEFAULT_FONT }
        },
        closeCallback() {
          setTimeout(() => {
            game.input.onDown.addOnce(function() {
              game.state.start('home')
            }, this)
          })
        }
      },
    ]
  }

  this.create = function() {
    this.stage.backgroundColor = '#333';

    game.add.text(game.world.centerX, game.world.centerY - 200, '點擊返回遊戲首頁', { fill: '#ffffff',font: 'bold 26pt ' + DEFAULT_FONT,}).anchor.set(0.5)

    if(res.status === 'success') {
      showPopup(overPopupList[game.rnd.between(0, overPopupList.length -1)])
    } else if ((res.status === 'fail')){
      alert(_errorCenter(res.data.code))
      game.input.onDown.addOnce(function() {
        game.state.start('home')
      }, this)
    } else {
      console.log('Api error')
    }

    isPlayed[dudeMap[overDude].weapon] = true
  }

  function _errorCenter(code) {
    let text
    switch(code) {
      case 401:
        text = '恭喜您！已達5000彩票上限，不會再累計囉～記得雙11當天，回來盡情使用唷！'
        break;
      case 406:
        text = '您已獲得彩票'
        break;
      case 408:
        text = '找不到對應的活動內容'
        break;
      case 409:
        text = '您好像已經玩過囉～'
        break;
      case 410:
        text = '活動時間已截止'
        break;
      case 2:
        text = '彩券新增失敗'
        break;
      case 999:
      default:
        text = '喔喔！系統忙碌中～'
    }
    return text
  }
}

game.state.add('slash', slash)
game.state.add('init', init)
game.state.add('home', home)
game.state.add('play', play)
game.state.add('over', over)

if(checkOffline()) {
  alert('活動已結束，感謝您的參與！\n請持續關注露天活動，好康不錯過～')
} else {
  game.state.start('slash')
}

if(document.querySelectorAll('canvas').length > 0) {
  document.querySelectorAll('canvas')[0].remove()
}

function showPopup(current) {
  let
    popopContainer,
    closeBtn,
    actionBtn,
    text,
    overlay

  popopContainer = game.add.image(game.world.centerX, game.world.centerY, current.name)
  popopContainer.anchor.set(0.5)
  closeBtn = game.add.button(game.world.centerX + 185, game.world.centerY - 260, 'close_btn', ()=>{
    popopContainer.destroy()
    closeBtn.destroy()
    text.destroy()
    overlay.destroy()
    if(actionBtn) actionBtn.destroy()
    if(current.closeCallback) current.closeCallback()
  }, this, 2, 1, 0)
  closeBtn.anchor.set(0.5)
  closeBtn.input.priorityID = 1

  if(current.action) {
    actionBtn = game.add.button(current.action.x, current.action.y, 'bn7', current.action.callback, this, 2, 1, 0)
    actionBtn.anchor.set(0.5)
    actionBtn.input.priorityID = 1
  }

  text = game.add.text(current.label.x, current.label.y, current.label.text, Object.assign({ fill: '#ffffff' }, current.label.style))
  if(current.label.config) Object.assign(text, current.label.config)
  text.anchor.set(0.5)

  // This is event #1 added to background sprite
  overlay = game.add.sprite(0, 0)
  overlay.fixedToCamera = true
  overlay.scale.setTo(game.width, game.height)
  overlay.inputEnabled = true
  overlay.input.priorityID = 0 // lower priority
}

function filterText(text, num) {
  return text.split('').reduce(((reducer, value, index) => {
    if(index === 0 || index !== text.length -1) {
      return (index + 1) % num ? reducer + value : reducer + value + '\n'
    } else {
      return reducer + value
    }
  }))
}