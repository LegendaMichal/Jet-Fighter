const maxOfAbs = (val1, val2) => {
    return Math.abs(val1) > Math.abs(val2) ? val1 : val2;
};

const radToDeg = (angle) => {
    return angle * (180/Math.PI);
};

const degToRad = (angle) => {
    return angle * Math.PI/180;
}

function padding(a, b, c, d) {
    return {
      paddingTop: a,
      paddingRight: b ? b : a,
      paddingBottom: c ? c : a,
      paddingLeft: d ? d : (b ? b : a)
    }
  }

export { maxOfAbs, radToDeg, degToRad, padding };