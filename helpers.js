'use strict';
const range = require('node-range');
const pad = require('pad');
const helpers = {};

Array.prototype.trim = function(proc) {
    const newArr = [];
    for (let i = 0; i < this.length * proc; i++) {
        newArr.push(this[i]);
    }
    return newArr;
};


helpers.std = (arr)=> {
    arr = arr.sort();

    let left = arr.trim(0.5);
    let right = arr.reverse().trim(0.5);

    const leftCnt = left.length;
    const rightCnt = right.length;

    const leftMean = helpers.avg(left);
    const rightMean = helpers.avg(right);

    left = left.map(val => Math.pow(Math.abs(leftMean - val), 2));
    right = right.map(val => Math.pow(Math.abs(rightMean - val), 2));

    left = helpers.sum(left) / leftCnt;
    right = helpers.sum(right) / rightCnt;

    left = Math.sqrt(left);
    right = Math.sqrt(right);

    return {
        left,
        right,
    }
};

helpers.max = (arr) => {
    let max = 0;
    for (let i = 0; i < arr.length; i++) {
        if (max < arr[i]) {
            max = arr[i];
        }
    }
    return max;
};
helpers.min = (arr) => {
    let min = Infinity;
    for (let i = 0; i < arr.length; i++) {
        if (min > arr[i]) {
            min = arr[i];
        }
    }
    return min;
};

helpers.avg = (arr) => {
    return helpers.sum(arr) / arr.length;
};

helpers.sum = (arr) => {
    return arr.reduce((sum, val) => sum + val);
};

helpers.outputTime = (arr, proc) => {
    arr = arr.trim(proc);
    const std = helpers.std(arr);

    const str = [
        'time @ ', pad(3, proc * 100), '%', '|',
        'min:', helpers.min(arr) | 0,
        'left std:', std.left | 0,
        'mean:', helpers.avg(arr) | 0,
        'right std:', std.right | 0, '|',
        'max:', helpers.max(arr) | 0
    ].join(' ');
    console.log(str);

    return str;
};

module.exports = helpers;