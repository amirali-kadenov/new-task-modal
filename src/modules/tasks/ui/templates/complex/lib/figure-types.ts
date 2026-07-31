/** Mirrors backend FigureType (Matheducator enums). */
export const FigureType = {
  Text: 10,
  NumberLine: 20,
  EulerEllipse: 30,
  IntervalNumberLine: 40,
  AngleList: 50,
  Rectangle: 60,
  Hexagon: 70,
  Cube: 80,
  TwoParallelOneIntersection: 90,
  TwoParallelTwoIntersection: 100,
  CoordinatePlane: 110,
  Table: 120,
  PositiveCoordinatePlane: 130,
  CoordinatePlane3D: 140,
  TrigonometryCoordinatePlane: 150,
  Image: 160,
  Html: 170,
  MultipleChoice: 180,
  FrequencyPolygon: 190,
  FrequencyHistogram: 200,
  ItemsFlex: 210,
  DrawingPolygon: 220,
  Filling: 230,
  CoordinateLine: 240,
} as const

export type FigureTypeId = (typeof FigureType)[keyof typeof FigureType]
