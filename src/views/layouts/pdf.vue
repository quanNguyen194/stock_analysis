<template>
  <div class="pdf-export">
    <Loader :visible="isLoading" position="fixed"/>
    <div class="book" id="printMe">
      <div class="print__btn no_print" @click="printWindow">
        <i class="fas fa-print"></i>
      </div>
      <slot/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Loader from '../../components/loader'

export default {
  name: 'pdf-layout',
  components: {
    Loader
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({ isLoading: 'isLoading' })
  },
  methods: {
    printWindow () {
      window.print()
      // this.$htmlToPaper('printMe')
    },
    getBrowser () {
      // Opera 8.0+
      // eslint-disable-next-line no-undef
      var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0

      // Firefox 1.0+
      var isFirefox = typeof InstallTrigger !== 'undefined'

      // Safari 3.0+ "[object HTMLElementConstructor]"
      var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === '[object SafariRemoteNotification]' })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification))

      // Internet Explorer 6-11
      var isIE = /* @cc_on!@ */false || !!document.documentMode

      // Edge 20+
      var isEdge = !isIE && !!window.StyleMedia

      // Chrome 1 - 79
      var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)

      // Edge (based on chromium) detection
      var isEdgeChromium = isChrome && (navigator.userAgent.indexOf('Edg') !== -1)

      // Blink engine detection
      var isBlink = (isChrome || isOpera) && !!window.CSS

      if (isOpera) {
        return 'Opera'
      } else if (isFirefox) {
        return 'Firefox'
      } else if (isSafari) {
        return 'Safari'
      } else if (isIE) {
        return 'IE'
      } else if (isEdge) {
        return 'Edge'
      } else if (isChrome) {
        return 'Chrome'
      } else if (isEdgeChromium) {
        return 'isEdgeChromium'
      } else if (isBlink) {
        return 'Blink'
      }
    }
  }

}
</script>

<style lang="scss">
body {
  background-color: #fff;
  font: 12pt 'Tahoma';
  -webkit-print-color-adjust: exact !important;
}
* {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}
.page {
  width: 210mm;
  max-height: 297mm;
  padding: 10mm;
  margin: 10mm auto;
  //border: 1px #d3d3d3 solid;
  border-radius: 5px;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.subpage {
  padding: 0.5cm;
  border: 5px #c5c5c5 solid;
  height: 276mm;
  position: relative;
  outline: 1cm #f1f1f1 solid;
}
.print__btn {
  position: fixed;
  top: 50px;
  z-index: 9;
  right: 50px;
  display: inline-block;
  border: 2px #c5c5c5 solid;
  border-radius: 10px;
  padding: 10px;
  background-color: #fff;

  &:hover {
    cursor: pointer;
    background-color: #cecece;
  }

  @media (max-width: 768px) {
    display: none;
  }
}

@page {
  size: A4;
  margin: 0 !important;
}

@media print {
  html, body, .page {
    width: 210mm;
    height: 260mm;
  }
  .page {
    border: initial;
    border-radius: initial;
    width: initial;
    margin: 0 !important;
    min-height: initial;
    box-shadow: initial;
    background: initial;
    page-break-after: always;
  }
  .no_print {
    display: none;
  }
  .note {
    min-height: 149px;
    background-color: gray;
    font-size: 13px;
    padding: 10px;
    border-top: 1px solid #dcdcdc;
    white-space: pre-wrap;
  }
}
</style>
