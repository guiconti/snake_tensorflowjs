class Matrix{

  constructor(rows, columns){
    this.rows = rows;
    this.columns = columns;
    this.data = [];

    for (let i = 0; i < this.rows; i++){
      this.data[i] = [];
      for (let j = 0; j < this.columns; j++){
        this.data[i][j] = 0;
      }
    }
  }

  randomize() {
    this.data.forEach(row => {
      row.forEach(value => {
        value = Math.floor(Math.random() * 10);
      });
    });
  }

  add(n) {

    if (n instanceof Matrix){
      for (let i = 0; i < this.rows; i++){
        for (let j = 0; j < this.columns; j++){
          this.data[i][j] += n[i][j];
        }
      }
    } else { 
      this.data.forEach(row => {
        row.forEach(value => {
          value += n;
        });
      });
    }
  }

  static multiply(m1, m2){
    if (m1.columns !== m2.rows)
      return undefined;
    let result = new Matrix(m1.rows, m2.columns);
    for (let i = 0; i < result.rows; i++){
      for (let j = 0; j < result.columns; j++){
        let sum = 0;
        for (let  k = 0; k < result.columns; k++){
          sum += this.data[i][k] * m2[k][j];
        }
        result.data[i][j] = sum;
      }
    }
    return result;
  }

  multiply(n) {
    if (n instanceof Matrix){
      if (this.columns !== n.rows)
        return undefined;
      let result = new Matrix(this.rows, n.columns);
      for (let i = 0; i < result.rows; i++){
        for (let j = 0; j < result.columns; j++){
          let sum = 0;
          for (let  k = 0; k < result.columns; k++){
            sum += this.data[i][k] * n[k][j];
          }
          result.data[i][j] = sum;
        }
      }
      this.data = result;
    } else {
      this.data.forEach(row => {
        row.forEach(value => {
          value *= n;
        });
      });
    }
  }

  static transpose(m){
    let result = new Matrix(m.cols, m.rows);
    for (let i = 0; i < m.rows; i++){
      for (let j = 0; j < m.columns; j++){
        result.data[j][i] = m.data[i][j];
      }
    }
    return result;
  }

  transpose() {
    let result = new Matrix(this.cols, this.rows);
    for (let i = 0; i < this.rows; i++){
      for (let j = 0; j < this.columns; j++){
        result.data[j][i] = this.data[i][j];
      }
    }
    this.data = result;
  }

  map(func){
    for (let i = 0; i < this.rows; i++){
      for (let j = 0; j < this.columns; j++){
        let value = this.data[i][j];
        this.data[j][i] = func(value, i, j);
      }
    }
  }

  print(){
    console.table(this.data);
  }
}

module.exports = Matrix;