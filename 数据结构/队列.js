function Queue() {
    this.dataStore = [];
    this.length = length;
    this.enqueue = enqueue;
    this.dequeue = dequeue;
    this.front = front;
    this.back = back;
    this.toString = toString;
    this.empty = empty;
}

function enqueue(element) {
    this.dataStore.push(element);
}

function dequeue() {
    return this.dataStore.shift();
}

function front() {
    return this.dataStore[0]
}

function back() {
    return this.dataStore[this.length() - 1];
}

function empty() {
    return this.length() ? true : false;
}

function toString() {
    let str = "";
    this.dataStore.map(item => {
        str += item + "\n"
    })
    return str;
}

function length() {
    return this.dataStore.length;
}

let q = new Queue();
q.enqueue('11');
q.enqueue('12');
q.enqueue('13');
q.enqueue('14');
console.log(q.toString())