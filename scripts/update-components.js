const fs = require('fs');
const path = require('path');

// 1. Update Navbar.jsx
const navbarPath = path.join(__dirname, '..', 'src', 'components', 'Navbar.jsx');
let navbar = fs.readFileSync(navbarPath, 'utf8');
navbar = navbar.replace(
  /<a href="#hero" className="flex items-center gap-3 group">[\s\S]*?<\/a>/,
  `<a href="#hero" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Skill.jobs"
            className="h-8 sm:h-9 w-auto object-contain hover:opacity-90 transition-opacity"
          />
          <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-cyan-400 font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            Smart NFC
          </span>
        </a>`
);
fs.writeFileSync(navbarPath, navbar, 'utf8');
console.log('Updated Navbar.jsx');

// 2. Update Footer.jsx
const footerPath = path.join(__dirname, '..', 'src', 'components', 'Footer.jsx');
let footer = fs.readFileSync(footerPath, 'utf8');
footer = footer.replace(
  /<div className="flex items-center gap-3">[\s\S]*?<\/span>[\s\S]*?<\/div>/,
  `<div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Skill.jobs"
                className="h-7 sm:h-8 w-auto object-contain"
              />
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                Smart NFC
              </span>
            </div>`
);
fs.writeFileSync(footerPath, footer, 'utf8');
console.log('Updated Footer.jsx');

// 3. Update AdminLayout.jsx
const adminLayoutPath = path.join(__dirname, '..', 'src', 'admin', 'components', 'AdminLayout.jsx');
let adminLayout = fs.readFileSync(adminLayoutPath, 'utf8');
adminLayout = adminLayout.replace(
  /<Link href={ROUTES\.ADMIN\.DASHBOARD} className="flex items-center gap-2\.5">[\s\S]*?<\/Link>/,
  `<Link href={ROUTES.ADMIN.DASHBOARD} className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Skill.jobs" className="h-7 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-white leading-tight">
                  Skill.jobs<span className="text-cyan-400 font-mono text-xs ml-1">OS</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Admin Suite</span>
              </div>
            </Link>`
);
fs.writeFileSync(adminLayoutPath, adminLayout, 'utf8');
console.log('Updated AdminLayout.jsx');

// 4. Update AdminLogin.jsx
const adminLoginPath = path.join(__dirname, '..', 'src', 'admin', 'pages', 'AdminLogin.jsx');
let adminLogin = fs.readFileSync(adminLoginPath, 'utf8');
adminLogin = adminLogin.replace(
  /<div className="flex justify-center mb-2">[\s\S]*?<\/div>[\s\S]*?<\/div>/,
  `<div className="flex justify-center mb-2">
            <img src="/logo.png" alt="Skill.jobs" className="h-10 w-auto object-contain" />
          </div>`
);
fs.writeFileSync(adminLoginPath, adminLogin, 'utf8');
console.log('Updated AdminLogin.jsx');
