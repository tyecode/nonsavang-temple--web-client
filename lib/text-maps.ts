const textMaps = {
  '/dashboard/overview': 'ພາບລວມ',
  '/dashboard/reports': 'ລາຍງານ',
  '/dashboard/users': 'ຈັດການຜູ້ໃຊ້',
  '/donators': 'ຈັດການຜູ້ບໍລິຈາກ',
  '/dashboard/incomes': 'ຈັດການລາຍຮັບ',
  '/dashboard/expenses': 'ຈັດການລາຍຈ່າຍ',
  '/dashboard/income-categories': 'ຈັດການປະເພດລາຍຮັບ',
  '/expense-categories': 'ຈັດການປະເພດລາຍຈ່າຍ',
  '/accounts': 'ຈັດການບັນຊີ',
  '/currencies': 'ຈັດການສະກຸນເງິນ',
  '/pending': 'ລາຍການທີ່ລໍຖ້າອະນຸມັດ',
  '/approved': 'ລາຍການທີ່ອະນຸມັດແລ້ວ',
  '/rejected': 'ລາຍການທີ່ຖືກປະຕິເສດ',
}

export const getTextFromPathname = (pathname: string) => {
  return textMaps[pathname as keyof typeof textMaps] || pathname
}
