/*jshint esversion: 6 */
class MaxHeap {
  static DEFAULT_SIZE = 1023;

  /**
   * Create a new empty max heap of a given size, optionally from an existing array
   *
   * @param {number} [size=1023] Maximum capacity of the queue
   * @param {{priority: number, element: *}[]} [fromArray] Build the heap from this array instead. The given array must be 1-indexed, and records must have the given form.
   */
  constructor({ size = this.constructor.DEFAULT_SIZE, fromArray } = {}) {
    if (fromArray) {
      this._storage = fromArray;
      this.size = fromArray.length - 1;
      this._count = this.size;
      this._buildheap();

    } else {
      this.size = size;

      // Create storage array with sentinel
      this._storage = [null];

      // Add record slots to storage array
      for (let i = 1; i <= size; i += 1) {
        this._storage.push({ priority: undefined, element: undefined });
      }

      // Last index will always be at count
      this._count = 0;
    }
  }

  /**
   * Use a heap to sort an array in-place in n*log(n) time
   *
   * @param {{priority: number, element: *}[]} [array] Data to sort. The given array must be 1-indexed, and records must have the given form.
   */
  static heapsort(array) {
    const heap = new MaxHeap({ fromArray: array });
    heap.sort();
  }

  _left(i) {
    return 2 * i;
  }

  _right(i) {
    return 2 * i + 1;
  }

  _parent(i) {
    return Math.floor(i / 2);
  }

  _swap(i, j) {
    // Note: in a language like C, Java or Rust, where the array is full of records
    // instead of references to records, we would need to swap the priority and
    // the reference to the element instead of the records themselves.
    const temp = this._storage[i];
    this._storage[i] = this._storage[j];
    this._storage[j] = temp;
  }

  _float(i) {
    // i == index of element to float.  P == index of parent
    let p = this._parent(i);
    while ((this._storage[i] && this._storage[p]) && this._storage[i].priority > this._storage[p].priority) {
      //swap records
      this._swap(i, p);
      //record i is now at parent index
      i = p;
      //find new parent index
      p = this._parent(i);
    }
  }

  _sink(i) {

    const inBounds = (j) => j <= this._count;
    const priority = (j) => this._storage[j].priority;

    let finished = false;
    //can I just sset max to 0 here?
    while (!finished) {
      // i == index of element to sink.  l/r are indecies of left and right children
      let l = this._left(i);
      let r = this._right(i);
      //we can assume that prioority at index i is max until proven wrong.
      let max = i;

      if (inBounds(l) && priority(l) > priority(i)) {
        max = l;
      }

      if (inBounds(r) && priority(r) > priority(max)) {
        max = r;
      }
      //if neither l or right was larger, max is still at i and heap should be good to go.
      if (max === i) {
        finished = true;
      } else {
        //swap values at i and whichever has the max value.
        this._swap(i, max);
        i = max;
      }
    }
  }

  _buildheap() {
    //Why size and not count here?
    //find midpoint
    let i = Math.floor(this._size / 2);
    while (i > 0) {
      this._sink(i);
      i -= 1;
    }
  }

  /**
   * Add a record to the queue with a given priority
   *
   * @param {number} priority Priority of the record
   * @param {*} element Data to store in this record
   * @throws If the heap is full
   */
  insert(priority, element) {
    // Insert at end of current array - always going to be the size.
    //check that we have room
    if (this._count < this.size) {
      //increase size by 1.
      this._count += 1;
      //insert at end of Array
      this._storage[this._count] = { priority: priority, element: element };
    } else {
      //throw error that we're full ma'am!
      throw new Error("This queue is full, ma'am");
    }

    //element is now at index this._count.  Float up until
    //Finds right place in max heap
    this._float(this._count);
  }

  /**
   * Remove and return the record with the highest priority
   *
   * @returns {*} The data stored in the highest-priority record, or undefined if the queue is empty
   */
  removeMax() {
    if (this._count > 0) {
      //max priority record to remove is at 1 - save value.
      const returnValue = this._storage[1].element;

      // swap element to remove (first/head) with last el currently in queue & decrease count.
      this._swap(1, this._count);

      // record values == undefined && reduce count.
      this._storage[this._count] = {priority: undefined, element: undefined};
      this._count -= 1;

      //sink new head to correct place in the heapsort
      this._sink(1);
      return returnValue;
    }
  }

  /**
   * How many records are in the priority queue?
   *
   * @returns {number} Record count
   */
  count() {
    return this._count;
  }

  /**
   * Turn this max heap into a sorted array
   *
   * Destroys the max heap in the process - insert, removeMax, etc will NOT
   * work after this function has been run
   *
   * @returns Sorted storage array. Note that the array is 1-indexed (so the first element is null)
   */
  sort() {
    //remove max but don't actually remove.
    for (let i = this._count; i > 0; i -= 1) {
      this._swap(1, this._count);
      this._count -= 1;
      this._sink(1);
    }
    return this._storage;
  }
}

export default MaxHeap;
