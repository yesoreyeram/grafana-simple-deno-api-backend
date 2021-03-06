import Query from "./Query.ts";
import { timeSeriesResult } from "./../../types.d.ts";
import * as MOCK_DATA from "./../../data/index.ts";
import { sample } from "./../../utils/_.ts";

export default class Expression extends Query {
  seriesName: string;
  operations: string[];
  constructor(queryString: string) {
    super("timeserie", queryString, { token: "Expression" });
    this.seriesName = this.queryObjects[0] || sample(MOCK_DATA.RANDOM_WORDS);
    this.operations = this.queryObjects.slice(1);
  }
  toGrafanaSeriesList(startTime: number, endTime: number): timeSeriesResult[] {
    const result: timeSeriesResult[] = [];
    result.push({
      target: this.seriesName,
      datapoints: MOCK_DATA.getRandomWalkDataPoints(
        startTime,
        endTime,
        [0],
        [0]
      ).map((item, index) => {
        const value = this.operations.reduce(
          (prev: number | null, curr: string, currentIndex: number) => {
            const currentOperation = curr.split(":");
            const operation = currentOperation[0];
            let value1 = 0;
            if (prev === null) {
              return prev;
            }
            switch (currentOperation[1]) {
              case "index":
                value1 = +index;
                break;
              default:
                value1 = currentOperation[1] ? +currentOperation[1] : 0;
                break;
            }
            switch (operation) {
              case "rand":
              case "random":
                prev = Math.random();
                break;
              case "add":
                prev = prev + value1;
                break;
              case "minus":
                prev = prev - value1;
                break;
              case "multiply":
                prev = prev * value1;
                break;
              case "divide":
                prev = prev / value1;
                break;
              case "abs":
                prev = Math.abs(prev);
                break;
              case "pow":
                prev = Math.pow(prev, value1);
                break;
              case "sqrt":
                prev = Math.sqrt(prev);
                break;
              case "max":
                prev = Math.max(prev, value1);
                break;
              case "min":
                prev = Math.min(prev, value1);
                break;
              case "sin":
                prev = Math.sin(prev);
                break;
              case "cos":
                prev = Math.cos(prev);
                break;
              case "tan":
                prev = Math.tan(prev);
                break;
              case "ceil":
                prev = Math.ceil(prev);
                break;
              case "floor":
                prev = Math.floor(prev);
                break;
              case "round":
                prev = Math.round(prev);
                break;
              default:
                break;
            }
            switch (currentOperation[0]) {
              case "reset":
                prev = value1;
                break;
              case "start-after":
                prev = index < value1 ? null : prev;
                break;
              case "stop-after":
                prev = index >= value1 ? null : prev;
                break;
              default:
                break;
            }
            return prev;
          },
          index
        );
        return [value, item[1]];
      }),
    });
    return result;
  }
}
