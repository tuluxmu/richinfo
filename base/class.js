/**
 * 通用类,所有的类的创建全部用此类创建;
 * @param o
 * @returns {*}
 * @constructor
 */

function Class(o) {
  if (!(this instanceof Class) && isFunction(o)) {
    return classify(o)
  }
}

window.Class = Class;

//创建类
Class.create = function(parent1, properties) {
  if (!isFunction(parent1)) {
    properties = parent1;
    parent1 = null;
  }
  properties || (properties = {})
  parent1 || (parent1 = properties.Extends || Class)
  properties.Extends = parent1

  function SubClass() {
    parent1.apply(this, arguments)
    if (this.constructor === SubClass && this.initialize) {
      this.initialize.apply(this, arguments);
    }
  }

  if (parent1 !== Class) {
    mix(SubClass, parent1, parent1.StaticsWhiteList)
  }


  implement.call(SubClass, properties)

  return classify(SubClass)
}

function implement(properties) {
  var key, value

  for (key in properties) {
    value = properties[key]

    if (Class.Mutators.hasOwnProperty(key)) {
      Class.Mutators[key].call(this, value)
    } else {
      this.prototype[key] = value
    }
  }
}

//继承方法,所有通过此类创建的类都会具有继承的方法
Class.extend = function(properties) {
  properties || (properties = {})
  properties.Extends = this

  return Class.create(properties)
}
Class.guid=0;

function classify(cls) {
  cls.extend = Class.extend
  return cls
}


// 特殊属性.特殊处理..
Class.Mutators = {

  'Extends': function(parent) {
    var existed = this.prototype
    var proto = createProto(parent.prototype)
    mix(proto, existed)
    proto.constructor = this
    this.prototype = proto
    this.superclass = parent.prototype
  },
  'Implements': function(items) {
    isArray(items) || (items = [items])
    var proto = this.prototype, item

    while (item = items.shift()) {
      mix(proto, item.prototype || item)
    }
  },
  'Statics': function(staticProperties) {
    mix(this, staticProperties)
  }
}

//性能最好的原型复制,此方法为性能最佳;
function Ctor() {
}
var createProto = Object.__proto__ ?
    function(proto) {
      return { __proto__: proto }
    } :
    function(proto) {
      Ctor.prototype = proto
      return new Ctor()
    }


function mix(r, s, wl) {
  for (var p in s) {
    if (s.hasOwnProperty(p)) {
      if (wl && indexOf(wl, p) === -1) continue
      if (p !== 'prototype') {
        r[p] = s[p]
      }
    }
  }
}


var toString = Object.prototype.toString

var isArray = Array.isArray || function(val) {
    return toString.call(val) === '[object Array]'
}

var isFunction = function(val) {
  return toString.call(val) === '[object Function]'
}

var indexOf = Array.prototype.indexOf ?
    function(arr, item) {
      return arr.indexOf(item)
    } :
    function(arr, item) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] === item) {
          return i
        }
      }
      return -1
    }