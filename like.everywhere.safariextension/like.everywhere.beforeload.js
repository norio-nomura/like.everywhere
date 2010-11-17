/*

The MIT License

Copyright (c) 2010 Norio Nomura

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

if (window.top === window) {
    
    window.top.likeEverywhere = {};
    
    var LikeFrame = function (obj) {
        this.URL = 'http://www.facebook.com/plugins/like.php';
        this.params = obj;
        this.iframe = window.top.document.createElement('iframe');
        this.iframe.allowTransparency = 'true';
        this.iframe.frameborder = '0';
        this.iframe.scrolling = 'no';
        this.style = this.iframe.style;
        this.style.border = 'none';
        this.style.display = 'block';
        this.style.overflow = 'hidden';
        this.style.height = this.params.height + 'px';
        this.style.width = this.params.width + 'px';
        this.style.webkitTransitionDuration = '0.3s';
        this.style.webkitTransitionProperty = 'all';
    };
    
    if (LikeFrame.prototype.defineProperty) {
        LikeFrame.prototype.defineProperty(LikeFrame.prototype, 'href', {
            getter: function () {
                return this.params.href;
            },
            setter: function (newHref) {
                this.params.href = encodeURIComponent(newHref);
                var paramsArray = [], newSrc;
                for (var i in this.params) {
                    paramsArray.push(i + '=' + this.params[i]);
                }
                newSrc = this.URL + '?' + paramsArray.sort().join('&');
                if (this.iframe.src !== newSrc) {
                    this.iframe.src = newSrc;
                }
            }
        });
    } else {
        LikeFrame.prototype.__defineGetter__('href', function () {
            return this.params.href;
        });
        LikeFrame.prototype.__defineSetter__('href', function (newHref) {
            this.params.href = encodeURIComponent(newHref);
            var paramsArray = [], newSrc;
            for (var i in this.params) {
                paramsArray.push(i + '=' + this.params[i]);
            }
            newSrc = this.URL + '?' + paramsArray.sort().join('&');
            if (this.iframe.src !== newSrc) {
                this.iframe.src = newSrc;
            }
        });
    }
    
    LikeFrame.prototype.addEventListener = function (type, listener, useCapture) {
        this.iframe.addEventListener(type, listener, useCapture);
    };
    
    LikeFrame.prototype.shrinkHeight = function () {
        this.style.height = '0px';
        this.style.paddingTop = '0px';
        this.style.paddingBottom = '0px';
    };
    
    LikeFrame.prototype.restoreHeight = function () {
        this.style.height = this.params.height + 'px';
        this.style.paddingTop = this.style.paddingLeft;
        this.style.paddingBottom = this.style.paddingLeft;
    };
    
    // frameStandard
    var frameStandard = new LikeFrame({
        layout: 'standard',
        show_faces: 'true',
        width: '450',
        action: 'like',
        colorscheme: 'light',
        height: '80'
    });
    frameStandard.style.backgroundColor = 'white';
    frameStandard.style.position = 'fixed';
    frameStandard.style.bottom = '3px';
    frameStandard.style.right = '3px';
    frameStandard.style.webkitBorderRadius = '3px';
    frameStandard.style.webkitBoxShadow = '0px 0px 10px rgba(0,0,0,1)';
    frameStandard.style.zIndex = '1001';
    frameStandard.addEventListener('mouseover', function (evt) {
        var frameStandard = window.top.likeEverywhere.frameStandard;
        if (frameStandard.timerID) {
            window.clearTimeout(frameStandard.timerID);
            delete frameStandard.timerID;
            frameStandard.restoreHeight();
        }
    });
    frameStandard.addEventListener('mouseout', function (evt) {
        var frameStandard = window.top.likeEverywhere.frameStandard;
        if (!frameStandard.timerID) {
            frameStandard.timerID = window.setTimeout(function () {
                frameStandard.shrinkHeight();
                delete frameStandard.timerID;
            }, 2000);
        }
    });
    frameStandard.shrinkHeight();
    window.top.likeEverywhere.frameStandard = frameStandard;

    // frameBoxCount
    var frameBoxCount = new LikeFrame({
        layout: 'box_count',
        width: '55',
        action: 'like',
        colorscheme: 'light',
        height: '65'
    });
    frameBoxCount.style.backgroundColor = 'transparent';
    frameBoxCount.style.position = 'fixed';
    frameBoxCount.style.bottom = '0px';
    frameBoxCount.style.right = '0px';
    frameBoxCount.style.display = 'block';
    frameBoxCount.style.opacity = '0.5';
    frameBoxCount.style.zIndex = '1000';
    frameBoxCount.addEventListener('mouseover', function () {
        var frameBoxCount = window.top.likeEverywhere.frameBoxCount;
        frameBoxCount.style.opacity = '1.0';
        if (!frameBoxCount.timerID) {
            frameBoxCount.timerID = window.setTimeout(function () {
                frameBoxCount.style.opacity = '0.5';
                window.top.likeEverywhere.frameStandard.restoreHeight();
                delete frameBoxCount.timerID;
            }, 3000);
        }
    });
    frameBoxCount.addEventListener('mouseout', function () {
        var frameBoxCount = window.top.likeEverywhere.frameBoxCount;
        if (frameBoxCount.timerID) {
            window.clearTimeout(frameBoxCount.timerID);
            delete frameBoxCount.timerID;
            frameBoxCount.style.opacity = '0.5';
        }
    });
    window.top.likeEverywhere.frameBoxCount = frameBoxCount;
    
    window.top.likeEverywhere.addFramesToBody = function () {
        var likeEverywhere = window.top.likeEverywhere;
        if (window.top.document.body) {
            delete likeEverywhere.addFramesToBody;
            window.top.document.body.appendChild(likeEverywhere.frameStandard.iframe);
            window.top.document.body.appendChild(likeEverywhere.frameBoxCount.iframe);
        }
    };
    
    window.document.addEventListener('load', function () {
        var likeEverywhere = window.top.likeEverywhere;
        if (likeEverywhere.addFramesToBody) {
            likeEverywhere.addFramesToBody();
        }
        likeEverywhere.frameStandard.href = window.top.document.URL;
        likeEverywhere.frameBoxCount.href = window.top.document.URL;
    }, true);

//} else {
//    window.document.addEventListener('load', function() {
//        var likeEverywhere = window.top.likeEverywhere;
//        likeEverywhere.frameStandard.href = window.top.document.URL;
//        likeEverywhere.frameBoxCount.href = window.top.document.URL;
//    }, true);
}
