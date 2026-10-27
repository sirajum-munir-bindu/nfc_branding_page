const fs = require('fs');
const path = require('path');

// 1. Update NFCCard3D.jsx
const nfcCardPath = path.join(__dirname, '..', 'src', 'components', 'NFCCard3D.jsx');
let nfcCardContent = fs.readFileSync(nfcCardPath, 'utf8');
nfcCardContent = nfcCardContent.replace(
  /<div className="flex items-center gap-1\.5">[\s\S]*?<\/span>[\s\S]*?<\/div>[\s\S]*?<\/div>/,
  `<div className="flex items-center">
                    <img
                      src="/logo.png"
                      alt="Skill.jobs"
                      className="h-6 sm:h-7.5 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                    />
                  </div>`
);
fs.writeFileSync(nfcCardPath, nfcCardContent, 'utf8');
console.log('Updated NFCCard3D.jsx');

// 2. Update OrderModal.jsx
const orderModalPath = path.join(__dirname, '..', 'src', 'components', 'OrderModal.jsx');
let orderModalContent = fs.readFileSync(orderModalPath, 'utf8');
orderModalContent = orderModalContent.replace(
  /<div className="flex items-center gap-1\.5 text-xs text-cyan-400 font-mono">[\s\S]*?<span>TapCard Checkout<\/span>[\s\S]*?<\/div>/,
  `<div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
                <img src="/logo.png" alt="Skill.jobs" className="h-5 w-auto object-contain" />
                <span>NFC Checkout</span>
              </div>`
);
fs.writeFileSync(orderModalPath, orderModalContent, 'utf8');
console.log('Updated OrderModal.jsx');

// 3. Update AdminLayout.jsx
const adminLayoutPath = path.join(__dirname, '..', 'src', 'admin', 'components', 'AdminLayout.jsx');
let adminLayoutContent = fs.readFileSync(adminLayoutPath, 'utf8');
adminLayoutContent = adminLayoutContent.replace(
  /<Link href={ROUTES\.ADMIN\.DASHBOARD} className="flex items-center gap-2\.5">[\s\S]*?<\/Link>/,
  `<Link href={ROUTES.ADMIN.DASHBOARD} className="flex items-center gap-2.5">
              <div className="py-1 px-2 rounded-xl bg-white/[0.04] border border-white/10">
                <img src="/logo.png" alt="Skill.jobs" className="h-6 w-auto object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-white leading-tight">
                  Skill.jobs<span className="text-cyan-400 font-mono text-xs ml-1">OS</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Admin Suite</span>
              </div>
            </Link>`
);
fs.writeFileSync(adminLayoutPath, adminLayoutContent, 'utf8');
console.log('Updated AdminLayout.jsx');

// 4. Update AdminLogin.jsx
const adminLoginPath = path.join(__dirname, '..', 'src', 'admin', 'pages', 'AdminLogin.jsx');
let adminLoginContent = fs.readFileSync(adminLoginPath, 'utf8');
adminLoginContent = adminLoginContent.replace(
  /<div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 p-\[1\.5px\] mx-auto shadow-lg shadow-cyan-500\/20">[\s\S]*?<\/div>[\s\S]*?<\/div>/,
  `<div className="flex justify-center mb-2">
            <div className="py-2 px-4 rounded-2xl bg-white/[0.04] border border-white/10 shadow-lg shadow-cyan-500/10">
              <img src="/logo.png" alt="Skill.jobs" className="h-9 w-auto object-contain" />
            </div>
          </div>`
);
adminLoginContent = adminLoginContent.replace('TapCard Admin Suite', 'Skill.jobs Admin Suite');
fs.writeFileSync(adminLoginPath, adminLoginContent, 'utf8');
console.log('Updated AdminLogin.jsx');

// 5. Update DigitalProfile.jsx
const digitalProfilePath = path.join(__dirname, '..', 'src', 'components', 'DigitalProfile.jsx');
let digitalProfileContent = fs.readFileSync(digitalProfilePath, 'utf8');
digitalProfileContent = digitalProfileContent.replace(
  '<span>Powered by TapCard NFC Platform</span>',
  '<span>Powered by Skill.jobs NFC Platform</span>'
);
digitalProfileContent = digitalProfileContent.replace(
  'TapCard Global Ltd • Dhaka, Bangladesh',
  'Skill.jobs • Dhaka, Bangladesh'
);
fs.writeFileSync(digitalProfilePath, digitalProfileContent, 'utf8');
console.log('Updated DigitalProfile.jsx');
