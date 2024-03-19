import {
  faAddressBook,
  faCreditCard,
  faFolderClosed,
  faMoneyBill1,
  faUser,
} from '@fortawesome/free-regular-svg-icons'
import {
  faDollarSign,
  faBarsStaggered,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const IconsCollection = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'folder-closed-icon':
      return (
        <FontAwesomeIcon
          icon={faFolderClosed}
          width={25}
          height={25}
          size='lg'
        />
      )

    case 'user-icon':
      return <FontAwesomeIcon icon={faUser} width={25} height={25} size='lg' />

    case 'chart-line-icon':
      return (
        <FontAwesomeIcon icon={faChartLine} width={25} height={25} size='lg' />
      )

    case 'dollar-sign-icon':
      return (
        <FontAwesomeIcon icon={faDollarSign} width={25} height={25} size='lg' />
      )

    case 'address-book-icon':
      return (
        <FontAwesomeIcon
          icon={faAddressBook}
          width={25}
          height={25}
          size='lg'
        />
      )

    case 'money-bill-icon':
      return (
        <FontAwesomeIcon icon={faMoneyBill1} width={25} height={25} size='lg' />
      )

    case 'credit-card-icon':
      return (
        <FontAwesomeIcon icon={faCreditCard} width={25} height={25} size='lg' />
      )

    case 'bar-staggered-right-icon':
      return (
        <FontAwesomeIcon
          icon={faBarsStaggered}
          width={25}
          height={25}
          size='lg'
        />
      )

    case 'bar-staggered-left-icon':
      return (
        <FontAwesomeIcon
          icon={faBarsStaggered}
          width={25}
          height={25}
          size='lg'
          rotation={180}
        />
      )

    default:
      return <span className='w-[25px]'></span>
  }
}
