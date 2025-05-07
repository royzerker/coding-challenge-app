export type MatrixStats = {
    max: number
    min: number
    avg: number
    sum: number
    isDiagonal: boolean
  }
  
export type StatsResponse = {
    Q: MatrixStats
    R: MatrixStats
  }
  