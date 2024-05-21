const textMaps = {
  '/dashboard/overview': 'ພາບລວມ',
  '/dashboard/reports': 'ລາຍງານ',
  '/users': 'ຈັດການຜູ້ໃຊ້',
  '/donators': 'ຈັດການຜູ້ບໍລິຈາກ',
  '/incomes': 'ຈັດການລາຍຮັບ',
  '/expenses': 'ຈັດການລາຍຈ່າຍ',
  '/income-categories': 'ຈັດການປະເພດລາຍຮັບ',
  '/expense-categories': 'ຈັດການປະເພດລາຍຈ່າຍ',
  '/accounts': 'ຈັດການບັນຊີ',
  '/currencies': 'ຈັດການສະກຸນເງິນ',
  '/pending': 'ລາຍການທີ່ລໍຖ້າອະນຸມັດ',
  '/approved': 'ລາຍການທີ່ອະນຸມັດແລ້ວ',
  '/rejected': 'ລາຍການທີ່ຖືກປະຕິເສດ',
  '/report-account': 'ລາຍງານບັນຊີ',
  '/report-income-expense': 'ລາຍງານລາຍຮັບ-ລາຍຈ່າຍ',
  '/report-donator': 'ລາຍງານຜູ້ບໍລິຈາກ',
}

export const getTextFromPathname = (pathname: string) => {
  return textMaps[pathname as keyof typeof textMaps] || pathname
}
