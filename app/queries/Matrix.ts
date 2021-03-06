import Query from "./Query.ts";
import { timeSeriesResult, dataPoint } from "./../../types.d.ts";
import * as MOCK_DATA from "./../../data/index.ts";

export default class Matrix extends Query {
  seriesName: string;
  xOffset: number;
  yOffset: number;
  matrix: (number | null)[][];
  constructor(queryString: string) {
    super("timeserie", queryString, { token: "Matrix" });
    this.seriesName = this.queryObjects[0];
    this.xOffset = +this.queryObjects[1];
    this.yOffset = +this.queryObjects[2];
    this.matrix = this.queryObjects
      .slice(3)
      .join(",")
      .split("]")
      .map((a) => a.replace("[", "").trim())
      .filter(Boolean)
      .map((a) => a.split(",").map((b) => (b ? +b : null)));
  }
  toGrafanaSeriesList(startTime: number, endTime: number): timeSeriesResult[] {
    const result: timeSeriesResult[] = [];
    const datapoints = MOCK_DATA.getRandomWalkDataPoints(
      startTime,
      endTime
    ).map((dp, index) => {
      const timestamp = dp[1];
      const actualValue = dp[0];
      return {
        timestamp,
        value: actualValue,
      };
    });
    let newDatapoints = datapoints.map((dp, index) => {
      const ts = dp.timestamp;
      return this.matrix[index - 1]
        ? this.matrix[index - 1].map((a) => {
            a = a ? a + this.yOffset : null;
            return [a, ts] as dataPoint;
          })
        : [];
    });
    if (this.xOffset > 0) {
      newDatapoints = datapoints.map((dp, index) => {
        if (index < this.xOffset) {
          return [];
        }
        const ts = dp.timestamp;
        return this.matrix[index - 1 - this.xOffset]
          ? this.matrix[index - 1 - this.xOffset].map((a) => {
              a = a ? a + this.yOffset : null;
              return [a, ts] as dataPoint;
            })
          : [];
      });
    }
    result.push({
      target: this.seriesName,
      datapoints: newDatapoints.reduce((a, b) => a.concat(b), []),
    });
    return result;
  }
}
export class LED extends Query {
  private letters: Matrix[];
  private yOffset: number;
  constructor(queryString: string) {
    super("timeserie", queryString, { token: "LED" });
    this.yOffset = +this.queryObjects[1] || 0;
    this.letters = this.queryObjects[0].split("").map((letter, index) => {
      let expressionMatrix = "";
      const offset = index * 6;
      switch (letter.toUpperCase()) {
        case "A":
          expressionMatrix = `Matrix(A${index + 1},${offset},${
            this.yOffset
          },[1,2,3,4,5,6,7,8][5,9][5,9][5,9][1,2,3,4,5,6,7,8])`;
          break;
        case "B":
          expressionMatrix = `Matrix(B${index + 1},${offset},${
            this.yOffset
          },[1,2,3,4,5,6,7,8,9][1,5,9][1,5,9][1,5,9][2,3,4,6,7,8])`;
          break;
        case "C":
          expressionMatrix = `Matrix(C${index + 1},${offset},${
            this.yOffset
          },[2,3,4,5,6,7,8][1,9][1,9][1,9][2,8])`;
          break;
        case "D":
          expressionMatrix = `Matrix(D${index + 1},${offset},${
            this.yOffset
          },[1,2,3,4,5,6,7,8,9][1,9][1,9][2,8][3,4,5,6,7])`;
          break;
        case "E":
          expressionMatrix = `Matrix(E${index + 1},${offset},${
            this.yOffset
          },[1,2,3,4,5,6,7,8,9][1,5,9][1,5,9][1,5,9][1,5,9])`;
          break;
        case "F":
          expressionMatrix = `Matrix(F${index + 1},${offset},${
            this.yOffset
          },[1,2,3,4,5,6,7,8,9][5,9][5,9][5,9][5,9])`;
          break;
        case "G":
          expressionMatrix = `Matrix(G${index + 1},${offset},${
            this.yOffset
          },[2,3,4,5,6,7,8][1,9][1,5,9][1,5,9][2,3,4,5,8])`;
          break;
        case "H":
          expressionMatrix = `Matrix(H${index + 1},${offset},${
            this.yOffset
          },[1,2,3,4,5,6,7,8,9][5][5][5][1,2,3,4,5,6,7,8,9])`;
          break;
        case "I":
          expressionMatrix = `Matrix(I${index + 1},${offset},${
            this.yOffset
          },[1,9][1,9][1,2,3,4,5,6,7,8,9][1,9][1,9])`;
          break;
        case "J":
          expressionMatrix = `Matrix(J${index + 1},${offset},${
            this.yOffset
          },[2,3,9][1,9][1,2,3,4,5,6,7,8,9][9][9])`;
          break;
        case "K":
          expressionMatrix = `Matrix(K${index + 1},${offset},${
            this.yOffset
          },[1,2,3,4,5,6,7,8,9][4,6][3,7][2,8][1,9])`;
          break;
        case "L":
          expressionMatrix = `Matrix(L${index + 1},${offset},${
            this.yOffset
          },[1,2,3,4,5,6,7,8,9][1][1][1][1])`;
          break;
        case "M":
          expressionMatrix = `Matrix(M${index + 1},${offset},${
            this.yOffset
          },[1,2,3,4,5,6,7,8,9][8,9][5,6,7,8][8,9][1,2,3,4,5,6,7,8,9])`;
          break;
        case "N":
          expressionMatrix = `Matrix(N${index + 1},${offset},${
            this.yOffset
          },[1,2,3,4,5,6,7,8,9][7,8,9][5,6,7][2,3,4][1,2,3,4,5,6,7,8,9])`;
          break;
        case "O":
          expressionMatrix = `Matrix(O${index + 1},${offset},${
            this.yOffset
          },[3,4,5,6,7][2,8][1,9][2,8][3,4,5,6,7])`;
          break;
        case "P":
          expressionMatrix = `Matrix(P${index + 1},${offset},${
            this.yOffset
          },[1,2,3,4,5,6,7,8,9][5,9][5,9][5,9][6,7,8])`;
          break;
        case "Q":
          expressionMatrix = `Matrix(Q${index + 1},${offset},${
            this.yOffset
          },[3,4,5,6,7][2,8][1,9][2,3,8][1,3,4,5,6,7])`;
          break;
        case "R":
          expressionMatrix = `Matrix(R${index + 1},${offset},${
            this.yOffset
          },[1,2,3,4,5,6,7,8,9][5,9][5,9][4,5,9][1,2,3,4,6,7,8])`;
          break;
        case "S":
          expressionMatrix = `Matrix(S${index + 1},${offset},${
            this.yOffset
          },[2,5,6,7,8][1,5,9][1,5,9][1,5,9][2,3,4,5,8])`;
          break;
        case "T":
          expressionMatrix = `Matrix(T${index + 1},${offset},${
            this.yOffset
          },[9][9][1,2,3,4,5,6,7,8,9][9][9])`;
          break;
        case "U":
          expressionMatrix = `Matrix(U${index + 1},${offset},${
            this.yOffset
          },[2,3,4,5,6,7,8,9][1,2][1][1,2][2,3,4,5,6,7,8,9])`;
          break;
        case "V":
          expressionMatrix = `Matrix(V${index + 1},${offset},${
            this.yOffset
          },[5,6,7,8,9][3,4,5][1,2][3,4,5][5,6,7,8,9])`;
          break;
        case "W":
          expressionMatrix = `Matrix(W${index + 1},${offset},${
            this.yOffset
          },[1,2,3,4,5,6,7,8,9][2][3,4,5][2][1,2,3,4,5,6,7,8,9])`;
          break;
        case "X":
          expressionMatrix = `Matrix(X${index + 1},${offset},${
            this.yOffset
          },[1,2,8,9][3,4,6,7][4,5,6][3,4,6,7][1,2,8,9])`;
          break;
        case "Y":
          expressionMatrix = `Matrix(Y${index + 1},${offset},${
            this.yOffset
          },[8,9][6,7][1,2,3,4,5,6][6,7][8,9])`;
          break;
        case "Z":
          expressionMatrix = `Matrix(Z${index + 1},${offset},${
            this.yOffset
          },[1,2,9][1,2,3,9][1,4,5,6,9][1,7,8,9][1,8,9])`;
          break;
        case "$":
          expressionMatrix = `Matrix(${letter}${index + 1},${offset},${
            this.yOffset
          },[1,2,3,4,5,6,7,8,9][1,2,3,4,5,6,7,8,9][1,2,3,4,5,6,7,8,9][1,2,3,4,5,6,7,8,9][1,2,3,4,5,6,7,8,9])`;
          break;
        case " ":
        case "*":
        default:
          expressionMatrix = `Matrix(*${index + 1},${offset},${
            this.yOffset
          },[][][][])`;
          break;
      }
      return new Matrix(expressionMatrix);
    });
  }
  toGrafanaSeriesList(startTime: number, endTime: number): timeSeriesResult[] {
    const result: timeSeriesResult[] = [];
    this.letters.forEach((letter) => {
      letter.toGrafanaSeriesList(startTime, endTime).forEach((v) => {
        result.push(v);
      });
    });
    return result;
  }
}
