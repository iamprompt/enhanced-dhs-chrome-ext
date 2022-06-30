import DIcon from '../../assets/D_icon_light.svg'

const Header = () => {
  return (
    <div
      className="bg-gradient-to-r from-blue-900 to-blue-700 p-3 fixed w-full top-0 left-0 h-14 flex items-center"
      id="header"
    >
      <img src={DIcon} alt="Disney" className="h-6" />
      <h1 className="font-bold text-white ml-2 text-lg">
        {chrome.i18n.getMessage('appName')}
      </h1>
    </div>
  )
}

export default Header
