module.exports = {
  inputs: {
    serverId: {
      type: 'string',
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
      if (inputs.filteredColumns[0] !== 'name' && inputs.filteredColumns[0] !== 'value') {
        throw new Error('Invalid Input: filteredColumns');
      }

      if (inputs.filteredColumns[1] && inputs.filteredColumns[1] !== 'name' && inputs.filteredColumns !== 'value') {
        throw new Error('Invalid Input: filteredColumns');
      }
    }

    if (inputs.sortedColumn && inputs.sortedColumn !== 'createdAt' && inputs.sortedColumn !== 'updatedAt' && inputs.sortedColumn !== 'name' && inputs.sortedColumn !== 'value' && inputs.sortedColumn !== 'preventDeletion') {
      throw new Error('Invalid Input: sortedColumns');
    }

    if (inputs.columnSortType && inputs.columnSortType !== 'ASC' && inputs.columnSortType !== 'DESC') {
      throw new Error('Invalid Input: columnSortTypes');
    }

    let escapedInputs = [''];

    escapedInputs[0] = inputs.serverId;
    escapedInputs[1] = inputs.searchQuery ? `%${inputs.searchQuery}%` : 'null';

    escapedInputs[2] = inputs.filteredColumns ? inputs.filteredColumns[0] : 'null';
    escapedInputs[3] = inputs.columnFilters ? `%${inputs.columnFilters[0]}%` : 'null';

    escapedInputs[4] = inputs.filteredColumns && inputs.filteredColumns[1] ? inputs.filteredColumns[1] : 'null';
    escapedInputs[5] = inputs.columnFilters && inputs.columnFilters[1] ? `%${inputs.columnFilters[1]}%` : 'null';

    escapedInputs[6] = inputs.sortedColumn ? inputs.sortedColumn : 'null';
    escapedInputs[7] = inputs.columnSortType ? inputs.columnSortType : 'null';

    escapedInputs[8] = inputs.pageSize;
    escapedInputs[9] = inputs.page;

    let search = ``;
    let filter = ``;
    let sorting = ``;

    if (inputs.searchQuery) {
      search = `AND (name LIKE $2 OR value LIKE $2)`;
    }

    if (inputs.filteredColumns) {
      filter = `AND $3 LIKE $4`;

      if (inputs.filteredColumns.length === 2) {
        filter = `AND ($3 LIKE $4 AND $5 LIKE $6)`;
      }
    }

    if (inputs.sortedColumn) {
      if (inputs.sortedColumn === 'name' || inputs.sortedColumn === 'value') {
        sorting = `ORDER BY LENGTH($7) $8, $7 $8`;
      } else {
        sorting = `ORDER BY $7 $8`;
      }
    }

    let pagination = `LIMIT $9`;

    if (inputs.page > 1) {
      pagination = `LIMIT $9 OFFSET $10`;
    }

    let sqlQuery =`
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
