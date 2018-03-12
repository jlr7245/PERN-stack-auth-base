module.exports = [
  {
    key: 'id',
    type: 'number',
    optional: true
  }, {
    key: 'title',
    type: 'string'
  }, {
    key: 'description',
    type: 'string'
  }, {
    key: 'category',
    type: 'string',
    otherCondition: (val) => ['Home', 'Work', 'School', 'Personal'].includes(val),
    otherConditionMessage: 'Category must be Home, Work, School, or Personal.'
  }
]
