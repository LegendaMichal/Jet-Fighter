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

function generateId() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 40; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function distancePointFromLine(point, linePoints) {
  const nomP1 = (linePoints.y2 - linePoints.y1)*point.x;
  const nomP2 = (linePoints.x2 - linePoints.x1)*point.y;
  const nomP3 = linePoints.x2*linePoints.y1 - linePoints.y2*linePoints.x1;
  const nominator = Math.abs(nomP1 - nomP2 + nomP3);
  const denominator = Math.sqrt(Math.pow(linePoints.y2 - linePoints.y1, 2) + Math.pow(linePoints.x2 - linePoints.x1, 2));
  return nominator / denominator;
}

export { maxOfAbs, radToDeg, degToRad, padding, generateId, distancePointFromLine };