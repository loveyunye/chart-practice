/* eslint-disable */
function GaussToBL(X, Y) {
  let ProjNo;
  let ZoneWide; // 带宽
  const output = new Array(2);
  let longitude1, latitude1, longitude0, X0, Y0, xval, yval; //latitude0,
  let e1, e2, f, a, ee, NN, T, C, M, D, R, u, fai, iPI;
  iPI = 3.14159265358979324 / 180.0;
  3.1415926535898 / 180.0;
  // a = 6378245.0; f = 1.0/298.3; //54年北京坐标系参数
  a = 6378140.0;
  f = 1.0 / 298.257; //80年西安坐标系参数
  ZoneWide = 6; // 6度带宽
  ProjNo = parseInt(X / 1000000); //查找带号
  longitude0 = (ProjNo - 1) * ZoneWide + ZoneWide / 2;
  longitude0 = longitude0 * iPI; //中央经线

  X0 = ProjNo * 1000000 + 500000;
  Y0 = 0;
  xval = X - X0;
  yval = Y - Y0; //带内大地坐标
  e2 = 2 * f - f * f;
  e1 = (1.0 - Math.sqrt(1 - e2)) / (1.0 + Math.sqrt(1 - e2));
  ee = e2 / (1 - e2);
  M = yval;
  u = M / (a * (1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256));
  fai =
    u +
    ((3 * e1) / 2 - (27 * e1 * e1 * e1) / 32) * Math.sin(2 * u) +
    ((21 * e1 * e1) / 16 - (55 * e1 * e1 * e1 * e1) / 32) * Math.sin(4 * u) +
    ((151 * e1 * e1 * e1) / 96) * Math.sin(6 * u) +
    ((1097 * e1 * e1 * e1 * e1) / 512) * Math.sin(8 * u);
  C = ee * Math.cos(fai) * Math.cos(fai);
  T = Math.tan(fai) * Math.tan(fai);
  NN = a / Math.sqrt(1.0 - e2 * Math.sin(fai) * Math.sin(fai));
  R =
    (a * (1 - e2)) /
    Math.sqrt(
      (1 - e2 * Math.sin(fai) * Math.sin(fai)) *
        (1 - e2 * Math.sin(fai) * Math.sin(fai)) *
        (1 - e2 * Math.sin(fai) * Math.sin(fai)),
    );
  D = xval / NN;
  //计算经度(Longitude) 纬度(Latitude)
  longitude1 =
    longitude0 +
    (D -
      ((1 + 2 * T + C) * D * D * D) / 6 +
      ((5 - 2 * C + 28 * T - 3 * C * C + 8 * ee + 24 * T * T) *
        D *
        D *
        D *
        D *
        D) /
        120) /
      Math.cos(fai);
  latitude1 =
    fai -
    ((NN * Math.tan(fai)) / R) *
      ((D * D) / 2 -
        ((5 + 3 * T + 10 * C - 4 * C * C - 9 * ee) * D * D * D * D) / 24 +
        ((61 + 90 * T + 298 * C + 45 * T * T - 256 * ee - 3 * C * C) *
          D *
          D *
          D *
          D *
          D *
          D) /
          720);
  //转换为度 DD
  output[0] = longitude1 / iPI;
  output[1] = latitude1 / iPI;
  return output;
}

const positions = [
  { X: '3167047.69', Y: '38592580.02' },
  { X: '3167047.69', Y: '38592880.03' },
  { X: '3166257.67', Y: '38593560.04' },
  { X: '3166247.67', Y: '38592140.02' },
  { X: '3165277.66', Y: '38592150.02' },
  { X: '3164492.65', Y: '38591033.01' },
  { X: '3164562.65', Y: '38590795.01' },
  { X: '3164572.65', Y: '38590665.01' },
  { X: '3164517.64', Y: '38590480' },
  { X: '3164682.65', Y: '38590522' },
  { X: '3164752.65', Y: '38590490' },
  { X: '3165052.65', Y: '38590415' },
  { X: '3165107.65', Y: '38590485' },
  { X: '3165097.65', Y: '38590542' },
  { X: '3165167.65', Y: '38590605' },
  { X: '3165012.65', Y: '38590935.01' },
  { X: '3165697.66', Y: '38591780.01' },
  { X: '3166467.67', Y: '38591780.01' },
  { X: '3166467.67', Y: '38592580.02' },
];
positions.forEach((i) => {
  // console.log(GaussToBL(Number(i.X), Number(i.Y)));
  console.log(GaussToBL(Number(i.Y), Number(i.X)));
});
