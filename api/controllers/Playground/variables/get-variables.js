module.exports = {
  inputs: {
    serverId: {
      type: 'number',
      required: true,
    },
    page: {
      type: 'number',
      required: true,
    },
    pageSize: {
      type: 'number',
      required: true,
    },
    filteredColumns: {
      type: ['string'],
      required: false,
    },
    columnFilters: {
      type: ['string'],
      required: false,
    },
    sortedColumn: {
      type: 'string',
      required: false,
    },
    columnSortType: {
      type: 'string',
      required: false,
    },
    searchQuery: {
      type: 'string',
      required: false,
    }
  },


  exits: {},


  fn: async function (inputs, exits) {
    const server = await SdtdServer.findOne({ id: inputs.serverId });

    if (!server) {
      return this.res.status(400).json({
        message: 'Server not found',
      });
    }

    if (inputs.filteredColumns) {
      switch(inputs.filteredColumns[0]) {
        case 'name':
        case 'value':
          break;
        default:
          throw new Error('Invalid Input: filteredColumns');
      }

      if (inputs.filteredColumns[1]) {
        switch(inputs.filteredColumns[1]) {
          case 'name':
          case 'value':
            break;
          default:
            throw new Error('Invalid Input: filteredColumns');
        }
      }
    }

    if (inputs.sortedColumn) {
      switch(inputs.sortedColumn) {
        case 'createdAt':
        case 'updatedAt':
        case 'name':
        case 'value':
        case 'preventDeletion':
          break;
        default:
          throw new Error('Invalid Input: sortedColumn');
      }
    }

    if (inputs.columnSortType && inputs.columnSortType !== 'ASC' && inputs.columnSortType !== 'DESC') {
      throw new Error('Invalid Input: columnSortType');
    }

    let escapedInputs = [''];

    escapedInputs[0] = inputs.serverId;
    escapedInputs[1] = inputs.searchQuery ? `%${inputs.searchQuery}%` : 'null';
    escapedInputs[2] = inputs.columnFilters ? `%${inputs.columnFilters[0]}%` : 'null';
    escapedInputs[3] = inputs.columnFilters && inputs.columnFilters[1] ? `%${inputs.columnFilters[1]}%` : 'null';

    let search = ``;

    if (inputs.searchQuery) {
      search = `AND (name LIKE $2 OR value LIKE $2)`;
    }

    let filter = ``;

    if (inputs.filteredColumns) {
      filter = `AND ${inputs.filteredColumns[0]} LIKE $3`;

      if (inputs.filteredColumns.length === 2) {
        filter = `AND (${inputs.filteredColumns[0]} LIKE $3 AND ${inputs.filteredColumns[1]} LIKE $4)`;
      }
    }

    let sorting = ``;

    if (inputs.sortedColumn) {
      if (inputs.sortedColumn === 'name' || inputs.sortedColumn === 'value') {
        sorting = `ORDER BY LENGTH(${inputs.sortedColumn}) ${inputs.columnSortType}, ${inputs.sortedColumn} ${inputs.columnSortType}`;
      } else {
        sorting = `ORDER BY ${inputs.sortedColumn} ${inputs.columnSortType}`;
      }
    }

    let pagination = `LIMIT ${inputs.pageSize}`;

    if (inputs.page > 1) {
      pagination = `LIMIT ${inputs.pageSize} OFFSET ${(inputs.page - 1) * inputs.pageSize}`;
    }

    let sqlQuery = `
    SELECT *
    FROM ${PersistentVariable.tableName}
    WHERE
      server = $1
      ${search}
      ${filter}
    ${sorting}
    `;

    const totalEntriesRawResult = await sails.sendNativeQuery(sqlQuery, escapedInputs);
    const totalEntries = totalEntriesRawResult.rows.length;

    sqlQuery = sqlQuery.concat(pagination);

    const rawResult = await sails.sendNativeQuery(sqlQuery, escapedInputs);

    const result = { variables: rawResult.rows.flat(), pageCount: Math.ceil(totalEntries / inputs.pageSize), totalEntries: totalEntries };

    return exits.success({ result });
  }
};
