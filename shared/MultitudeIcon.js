const React = require('react')
const PropTypes = require('prop-types')
import SvgIcon from '@material-ui/core/SvgIcon'

const style = {
  lightGradient: {
    stop1: {
      stopColor: 'rgb(255,255,255)'
    },
    stop2: {
      stopColor: 'rgb(232,232,232)'
    }
  },
  lightDarkGradient: {
    stop1: {
      stopColor: 'rgb(255,255,255)'
    },
    stop2: {
      stopColor: 'rgb(0,0,0)'
    }
  },
  radialGradient: {
    stop1: {
      stopColor: 'rgb(255,255,255)'
    },
    stop2: {
      stopColor: 'rgb(162,162,162)'
    },
    stop3: {
      stopColor: 'rgb(0,0,0)'
    },
    stop4: {
      stopColor: 'rgb(255,255,255)'
    }
  },
  colorOverlay: {
    mixBlendMode: 'color'
  },
  shineOverlay: {
    mixBlendMode: 'overlay'
  },
  screenBlend: {
    mixBlendMode: 'screen'
  }
}

const MultitudeIcon = (props) => {
  return (
    <SvgIcon viewBox='0 0 512 512' {...props}>
      <g id='Dark'>
        <path
          d=' M 371.917 283.693 C 381.578 292.539 394.447 297.936 408.578 297.953 C 438.589 297.953 462.975 273.567 462.975 243.556 L 462.975 168.894 C 474.568 195.931 481 225.728 481 256.994 C 481 380.606 380.645 480.961 257.032 480.961 C 133.42 480.961 33.065 380.606 33.065 256.994 C 33.065 133.382 133.42 33.026 257.032 33.026 C 287.528 33.026 316.608 39.136 343.108 50.191 L 267.174 58.63 L 267.174 145.655 L 267.174 149.919 L 267.174 212.021 C 263.662 211.304 260.025 210.928 256.298 210.928 C 226.286 210.928 201.9 235.314 201.9 265.307 C 201.918 295.337 226.268 319.687 256.298 319.705 C 286.291 319.705 310.677 295.319 310.677 265.307 L 310.677 162.569 L 310.677 140.817 L 419.472 128.741 L 419.472 190.251 C 415.942 189.535 412.305 189.158 408.578 189.158 C 388.741 189.158 371.358 199.832 361.866 215.743 C 351.148 192.879 333.031 174.202 310.677 162.569 L 310.677 265.307 C 310.677 295.319 286.291 319.705 256.298 319.705 C 226.268 319.687 201.918 295.337 201.9 265.307 C 201.9 235.314 226.286 210.928 256.298 210.928 C 260.025 210.928 263.662 211.304 267.174 212.021 L 267.174 149.919 C 263.823 149.633 260.455 149.489 257.032 149.489 C 192.763 149.489 140.569 201.683 140.569 265.952 C 140.569 330.222 192.763 382.416 257.032 382.416 C 315.255 382.416 363.549 339.605 371.917 283.693 Z ' />
        <path
          d=' M 267.174 149.919 C 263.823 149.633 260.455 149.489 257.032 149.489 C 192.763 149.489 140.569 201.683 140.569 265.952 C 140.569 330.222 192.763 382.416 257.032 382.416 C 315.3 382.416 363.623 339.539 371.937 283.565 C 361.007 273.693 354.216 259.431 354.198 243.556 C 354.198 233.414 356.976 223.918 361.903 215.82 C 351.188 192.921 333.056 174.215 310.677 162.569 L 310.677 265.307 C 310.677 295.319 286.291 319.705 256.298 319.705 C 226.268 319.687 201.918 295.337 201.9 265.307 C 201.9 235.314 226.286 210.928 256.298 210.928 C 260.025 210.928 263.662 211.304 267.174 212.021 L 267.174 149.919 Z ' fillOpacity='0.4' />
      </g>
    </SvgIcon>
  )
}

module.exports = MultitudeIcon
