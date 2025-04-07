// Chilean Spanish localization utilities
const CL_FORMATS = {
  date: (isoDate) => {
    return new Date(isoDate).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  datetime: (isoDate) => {
    return new Date(isoDate).toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Santiago'
    });
  },

  currency: (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  },

  number: (num) => {
    return new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }
};

export const formatForChile = (records) => {
  return records.map(record => ({
    ...record,
    fecha: record.fecha ? CL_FORMATS.date(record.fecha) : null,
    monto: record.monto ? CL_FORMATS.currency(record.monto) : null,
    // Add other fields that need formatting
    updatedAt: CL_FORMATS.datetime(record.updatedAt)
  }));
};