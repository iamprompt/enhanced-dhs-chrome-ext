const Footer = () => {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-3 font-bold text-white flex justify-between fixed bottom-0 left-0 w-full h-10">
      <div>{chrome.i18n.getMessage('popupCreditLeft')}</div>
      <div>{chrome.i18n.getMessage('popupCreditRight')}</div>
    </div>
  )
}

export default Footer
