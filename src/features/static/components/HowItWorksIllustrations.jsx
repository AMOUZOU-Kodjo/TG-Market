const C = {
  blue: "#2563EB",
  blueDark: "#1D4ED8",
  blueLight: "#DBEAFE",
  bluePale: "#EFF6FF",
  green: "#10B981",
  greenDark: "#059669",
  greenLight: "#D1FAE5",
  greenPale: "#ECFDF5",
  orange: "#F59E0B",
  orangeDark: "#D97706",
  orangeLight: "#FEF3C7",
  orangePale: "#FFFBEB",
  slate: "#334155",
  slateMid: "#64748B",
  slateLight: "#94A3B8",
  gray: "#F1F5F9",
  grayLight: "#F8FAFC",
  white: "#FFFFFF",
  skin: "#8B6914",
  skinLight: "#A47B1A",
  skinDark: "#6F5311",
  hair: "#1A1A2E",
  shirt1: "#2563EB",
  shirt2: "#10B981",
  shirt3: "#F59E0B",
  shirt4: "#7C3AED",
  pants1: "#334155",
  pants2: "#1E293B",
};

function Person({
  x = 0,
  y = 0,
  scale = 1,
  skinColor = C.skin,
  shirtColor = C.shirt1,
  pantsColor = C.pants1,
  hairStyle = "short",
  facing = "front",
  armPose = "down",
  legPose = "standing",
  expression = "smile",
}) {
  const s = scale;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* Shadow */}
      <ellipse cx="0" cy="78" rx="16" ry="4" fill={C.slate} opacity="0.08" />
      {/* Legs */}
      {legPose === "standing" && (
        <>
          <rect x="-8" y="52" width="7" height="24" rx="3.5" fill={pantsColor} />
          <rect x="1" y="52" width="7" height="24" rx="3.5" fill={pantsColor} />
          <ellipse cx="-4.5" cy="76" rx="5" ry="3" fill={C.slate} />
          <ellipse cx="4.5" cy="76" rx="5" ry="3" fill={C.slate} />
        </>
      )}
      {legPose === "walking" && (
        <>
          <rect x="-9" y="52" width="7" height="24" rx="3.5" fill={pantsColor} transform="rotate(-8,-5,52)" />
          <rect x="2" y="52" width="7" height="24" rx="3.5" fill={pantsColor} transform="rotate(8,5,52)" />
          <ellipse cx="-9" cy="75" rx="5" ry="3" fill={C.slate} transform="rotate(-8,-5,75)" />
          <ellipse cx="9" cy="75" rx="5" ry="3" fill={C.slate} transform="rotate(8,5,75)" />
        </>
      )}
      {/* Body / torso */}
      <rect x="-12" y="28" width="24" height="26" rx="8" fill={shirtColor} />
      {/* Arms */}
      {armPose === "down" && (
        <>
          <rect x="-18" y="30" width="7" height="22" rx="3.5" fill={shirtColor} />
          <rect x="11" y="30" width="7" height="22" rx="3.5" fill={shirtColor} />
          <circle cx="-14.5" cy="52" r="3.5" fill={skinColor} />
          <circle cx="14.5" cy="52" r="3.5" fill={skinColor} />
        </>
      )}
      {armPose === "phone" && (
        <>
          <rect x="-18" y="30" width="7" height="22" rx="3.5" fill={shirtColor} />
          <rect x="11" y="28" width="7" height="14" rx="3.5" fill={shirtColor} transform="rotate(-30,14,28)" />
          <circle cx="-14.5" cy="52" r="3.5" fill={skinColor} />
          {/* Hand holding phone */}
          <circle cx="5" cy="18" r="3.5" fill={skinColor} />
          <rect x="-1" y="6" width="12" height="18" rx="3" fill={C.slate} />
          <rect x="0.5" y="8" width="9" height="13" rx="1.5" fill={C.blueLight} />
        </>
      )}
      {armPose === "wave" && (
        <>
          <rect x="-18" y="30" width="7" height="22" rx="3.5" fill={shirtColor} />
          <rect x="11" y="22" width="7" height="18" rx="3.5" fill={shirtColor} transform="rotate(-50,14,22)" />
          <circle cx="-14.5" cy="52" r="3.5" fill={skinColor} />
          <circle cx="22" cy="12" r="3.5" fill={skinColor} />
        </>
      )}
      {armPose === "hold" && (
        <>
          <rect x="-18" y="30" width="7" height="22" rx="3.5" fill={shirtColor} />
          <rect x="11" y="30" width="7" height="16" rx="3.5" fill={shirtColor} />
          <circle cx="-14.5" cy="52" r="3.5" fill={skinColor} />
          <circle cx="14.5" cy="46" r="3.5" fill={skinColor} />
          <circle cx="-8" cy="46" r="3.5" fill={skinColor} />
        </>
      )}
      {armPose === "chat" && (
        <>
          <rect x="-18" y="30" width="7" height="22" rx="3.5" fill={shirtColor} />
          <rect x="11" y="26" width="7" height="16" rx="3.5" fill={shirtColor} transform="rotate(-25,14,26)" />
          <circle cx="-14.5" cy="52" r="3.5" fill={skinColor} />
          <circle cx="4" cy="16" r="3.5" fill={skinColor} />
          <rect x="-2" y="4" width="12" height="18" rx="3" fill={C.slate} />
          <rect x="-0.5" y="6" width="9" height="13" rx="1.5" fill={C.greenLight} />
          {/* Chat bubble on phone */}
          <rect x="1" y="8" width="6" height="4" rx="2" fill={C.white} />
          <rect x="1" y="14" width="4" height="3" rx="1.5" fill={C.white} />
        </>
      )}
      {armPose === "scan" && (
        <>
          <rect x="-18" y="30" width="7" height="22" rx="3.5" fill={shirtColor} />
          <rect x="11" y="24" width="7" height="18" rx="3.5" fill={shirtColor} transform="rotate(-40,14,24)" />
          <circle cx="-14.5" cy="52" r="3.5" fill={skinColor} />
          <circle cx="3" cy="14" r="3.5" fill={skinColor} />
          {/* Phone */}
          <rect x="-3" y="2" width="12" height="18" rx="3" fill={C.slate} />
          <rect x="-1.5" y="4" width="9" height="13" rx="1.5" fill={C.blueLight} />
          {/* QR on screen */}
          <rect x="0" y="5" width="6" height="6" rx="1" fill={C.white} />
          <rect x="7" y="5" width="3" height="3" rx="0.5" fill={C.slate} />
          <rect x="0" y="12" width="3" height="3" rx="0.5" fill={C.slate} />
        </>
      )}
      {armPose === "box" && (
        <>
          <rect x="-18" y="32" width="7" height="18" rx="3.5" fill={shirtColor} />
          <rect x="11" y="32" width="7" height="18" rx="3.5" fill={shirtColor} />
          <circle cx="-10" cy="44" r="3.5" fill={skinColor} />
          <circle cx="10" cy="44" r="3.5" fill={skinColor} />
          {/* Box */}
          <rect x="-12" y="36" width="24" height="16" rx="3" fill={C.orange} />
          <rect x="-12" y="36" width="24" height="5" rx="3" fill={C.orangeDark} />
          <rect x="-2" y="36" width="4" height="16" fill={C.orangeLight} opacity="0.4" />
        </>
      )}
      {/* Head */}
      <circle cx="0" cy="14" r="14" fill={skinColor} />
      {/* Hair */}
      {hairStyle === "short" && (
        <ellipse cx="0" cy="6" rx="13" ry="8" fill={C.hair} />
      )}
      {hairStyle === "puff" && (
        <>
          <ellipse cx="0" cy="4" rx="15" ry="11" fill={C.hair} />
          <ellipse cx="-8" cy="2" rx="6" ry="5" fill={C.hair} />
          <ellipse cx="8" cy="2" rx="6" ry="5" fill={C.hair} />
        </>
      )}
      {hairStyle === "fade" && (
        <>
          <path d="M-13 10 Q-14 -2 -6 -4 Q0 -8 6 -4 Q14 -2 13 10" fill={C.hair} />
        </>
      )}
      {hairStyle === "tresses" && (
        <>
          <ellipse cx="0" cy="5" rx="13" ry="9" fill={C.hair} />
          <rect x="-12" y="10" width="4" height="20" rx="2" fill={C.hair} transform="rotate(-5,-10,10)" />
          <rect x="8" y="10" width="4" height="20" rx="2" fill={C.hair} transform="rotate(5,10,10)" />
        </>
      )}
      {hairStyle === "tropics" && (
        <>
          <path d="M-12 12 Q-14 -4 0 -6 Q14 -4 12 12" fill={C.hair} />
          <circle cx="-8" cy="-2" r="4" fill={C.hair} />
          <circle cx="0" cy="-5" r="5" fill={C.hair} />
          <circle cx="8" cy="-2" r="4" fill={C.hair} />
        </>
      )}
      {/* Face */}
      {expression === "smile" && (
        <>
          <ellipse cx="-5" cy="13" rx="1.8" ry="2" fill={C.hair} />
          <ellipse cx="5" cy="13" rx="1.8" ry="2" fill={C.hair} />
          <path d="M-4 19 Q0 23 4 19" stroke={C.hair} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </>
      )}
      {expression === "happy" && (
        <>
          <path d="M-6 12 Q-5 10 -4 12" stroke={C.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M4 12 Q5 10 6 12" stroke={C.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M-4 19 Q0 24 4 19" stroke={C.hair} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </>
      )}
      {expression === "wow" && (
        <>
          <ellipse cx="-5" cy="13" rx="1.8" ry="2" fill={C.hair} />
          <ellipse cx="5" cy="13" rx="1.8" ry="2" fill={C.hair} />
          <ellipse cx="0" cy="21" rx="3" ry="2.5" fill={C.hair} />
        </>
      )}
      {expression === "wink" && (
        <>
          <ellipse cx="-5" cy="13" rx="1.8" ry="2" fill={C.hair} />
          <path d="M3.5 13 Q5 11 6.5 13" stroke={C.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M-4 19 Q0 23 4 19" stroke={C.hair} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* Cheek blush */}
      <circle cx="-8" cy="18" r="2.5" fill="#E8A060" opacity="0.25" />
      <circle cx="8" cy="18" r="2.5" fill="#E8A060" opacity="0.25" />
    </g>
  );
}

export function PhoneDownloadSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background circle */}
      <circle cx="150" cy="120" r="100" fill={C.bluePale} />
      <circle cx="150" cy="120" r="75" fill={C.blueLight} opacity="0.5" />

      <Person x={100} y={100} scale={1.1} shirtColor={C.shirt1} pantsColor={C.pants1} hairStyle="fade" armPose="phone" expression="happy" />

      {/* Floating download arrows */}
      <g transform="translate(195,55)">
        <circle cx="0" cy="0" r="16" fill={C.green} opacity="0.15" />
        <path d="M0 -6 L0 6" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M-4 2 L0 8 L4 2" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Floating elements */}
      <circle cx="60" cy="50" r="6" fill={C.orange} opacity="0.2" />
      <circle cx="240" cy="80" r="8" fill={C.blue} opacity="0.12" />
      <circle cx="70" cy="190" r="5" fill={C.green} opacity="0.18" />
      <rect x="220" y="160" width="12" height="12" rx="3" fill={C.orange} opacity="0.15" transform="rotate(15,226,166)" />
      <rect x="50" y="140" width="8" height="8" rx="2" fill={C.blue} opacity="0.12" transform="rotate(-10,54,144)" />

      {/* App store badges floating */}
      <g transform="translate(200,120)">
        <rect x="-20" y="-8" width="40" height="16" rx="8" fill={C.slate} opacity="0.1" />
        <rect x="-14" y="-4" width="6" height="8" rx="1" fill={C.slate} opacity="0.2" />
        <rect x="-5" y="-3" width="16" height="6" rx="1" fill={C.slate} opacity="0.15" />
      </g>
    </svg>
  );
}

export function CameraPhotoSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="150" cy="120" r="100" fill={C.orangePale} />
      <circle cx="150" cy="120" r="75" fill={C.orangeLight} opacity="0.5" />

      <Person x={100} y={95} scale={1.1} shirtColor={C.shirt3} pantsColor={C.pants2} hairStyle="puff" armPose="phone" expression="smile" />

      {/* Floating camera/photo elements */}
      <g transform="translate(200,60)">
        <rect x="-18" y="-12" width="36" height="28" rx="6" fill={C.white} stroke={C.orange} strokeWidth="2" />
        <circle cx="0" cy="2" r="8" fill={C.orangeLight} stroke={C.orange} strokeWidth="1.5" />
        <circle cx="0" cy="2" r="3" fill={C.orange} opacity="0.4" />
        <rect x="10" y="-8" width="5" height="3" rx="1.5" fill={C.orange} opacity="0.5" />
      </g>

      {/* Floating photo frames */}
      <g transform="translate(55,65)">
        <rect x="-14" y="-10" width="28" height="22" rx="4" fill={C.white} stroke={C.blueLight} strokeWidth="1.5" />
        <path d="M-10 4 L-5 -2 L0 2 L5 -1 L10 4 Z" fill={C.green} opacity="0.3" />
        <circle cx="6" cy="-4" r="3" fill={C.orange} opacity="0.3" />
      </g>

      <g transform="translate(220,150)">
        <rect x="-12" y="-8" width="24" height="18" rx="4" fill={C.white} stroke={C.greenLight} strokeWidth="1.5" />
        <rect x="-8" y="-4" width="16" height="10" rx="2" fill={C.greenPale} />
      </g>

      {/* Decorative dots */}
      <circle cx="60" cy="190" r="5" fill={C.orange} opacity="0.15" />
      <circle cx="250" cy="90" r="6" fill={C.blue} opacity="0.12" />
      <circle cx="45" cy="110" r="4" fill={C.green} opacity="0.15" />
    </svg>
  );
}

export function AdOnlineSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="150" cy="120" r="100" fill={C.greenPale} />
      <circle cx="150" cy="120" r="75" fill={C.greenLight} opacity="0.4" />

      <Person x={100} y={100} scale={1.05} shirtColor={C.shirt2} pantsColor={C.pants1} hairStyle="tropics" armPose="wave" expression="happy" />

      {/* Phone with listing */}
      <g transform="translate(195,70)">
        <rect x="-24" y="-35" width="48" height="70" rx="10" fill={C.slate} />
        <rect x="-20" y="-28" width="40" height="56" rx="4" fill={C.white} />
        {/* Product card on phone */}
        <rect x="-16" y="-24" width="32" height="20" rx="3" fill={C.grayLight} />
        <rect x="-16" y="-24" width="14" height="20" rx="3" fill={C.orangeLight} />
        <rect x="2" y="-20" width="12" height="4" rx="1" fill={C.gray} />
        <rect x="2" y="-14" width="8" height="3" rx="1" fill={C.gray} />
        <rect x="-16" y="0" width="32" height="8" rx="2" fill={C.greenPale} />
        <rect x="-12" y="2" width="8" height="4" rx="1" fill={C.green} opacity="0.4" />
        <rect x="0" y="12" width="32" height="8" rx="2" fill={C.bluePale} />
        <rect x="4" y="14" width="8" height="4" rx="1" fill={C.blue} opacity="0.3" />
        {/* Notch */}
        <rect x="-8" y="-34" width="16" height="4" rx="2" fill={C.slate} />
      </g>

      {/* Green check badge */}
      <g transform="translate(235,48)">
        <circle cx="0" cy="0" r="14" fill={C.green} />
        <path d="M-5 0 L-1 4 L6 -4" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Floating notification */}
      <g transform="translate(55,55)">
        <rect x="-22" y="-10" width="44" height="20" rx="10" fill={C.orange} opacity="0.15" />
        <circle cx="-10" cy="0" r="4" fill={C.orange} opacity="0.3" />
        <rect x="-3" y="-2" width="18" height="4" rx="2" fill={C.orange} opacity="0.2" />
      </g>

      {/* Floating hearts / likes */}
      <g transform="translate(240,140)">
        <path d="M0 -4 C0 -8 -5 -8 -5 -4 C-5 0 0 5 0 5 C0 5 5 0 5 -4 C5 -8 0 -8 0 -4 Z" fill={C.orange} opacity="0.2" />
      </g>
      <g transform="translate(50,170)">
        <path d="M0 -3 C0 -6 -4 -6 -4 -3 C-4 0 0 4 0 4 C0 4 4 0 4 -3 C4 -6 0 -6 0 -3 Z" fill={C.blue} opacity="0.15" />
      </g>

      <circle cx="260" cy="100" r="5" fill={C.blue} opacity="0.1" />
      <circle cx="40" cy="130" r="4" fill={C.orange} opacity="0.12" />
    </svg>
  );
}

export function SoldPackageSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="150" cy="120" r="100" fill={C.greenPale} />
      <circle cx="150" cy="120" r="75" fill={C.greenLight} opacity="0.4" />

      {/* Person with box */}
      <Person x={110} y={100} scale={1.1} shirtColor={C.shirt2} pantsColor={C.pants2} hairStyle="fade" armPose="box" expression="happy" />

      {/* Large package */}
      <g transform="translate(190,110)">
        <rect x="-28" y="-20" width="56" height="40" rx="6" fill={C.orange} />
        <rect x="-28" y="-20" width="56" height="10" rx="6" fill={C.orangeDark} />
        <rect x="-4" y="-20" width="8" height="40" fill={C.orangeLight} opacity="0.3" />
        {/* Tape */}
        <rect x="-28" y="-2" width="56" height="4" fill={C.orangeLight} opacity="0.25" />
        {/* Flaps */}
        <path d="M-28 -20 L-16 -30 L16 -30 L28 -20" fill={C.orangeDark} stroke={C.orangeDark} strokeWidth="1" />
        <line x1="0" y1="-30" x2="0" y2="-20" stroke={C.orangeDark} strokeWidth="1.5" />
      </g>

      {/* SOLD badge */}
      <g transform="translate(240,60)">
        <circle cx="0" cy="0" r="22" fill={C.green} />
        <circle cx="0" cy="0" r="18" fill={C.greenDark} />
        <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill={C.white} fontWeight="bold">VENDU</text>
      </g>

      {/* Check marks floating */}
      <g transform="translate(60,55)">
        <circle cx="0" cy="0" r="10" fill={C.green} opacity="0.15" />
        <path d="M-4 0 L-1 3 L5 -3" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      </g>

      {/* Stars */}
      <path d="M55 100 L57 94 L59 100 L65 101 L60 104 L62 110 L57 107 L52 110 L54 104 L49 101 Z" fill={C.orange} opacity="0.2" />
      <path d="M240 170 L241.5 166 L243 170 L247 171 L244 173 L245 177 L241.5 175 L238 177 L239 173 L236 171 Z" fill={C.orange} opacity="0.15" />

      <circle cx="45" cy="170" r="4" fill={C.blue} opacity="0.12" />
      <circle cx="260" cy="130" r="5" fill={C.green} opacity="0.15" />
    </svg>
  );
}

export function DeliveryOptionsSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="150" cy="120" r="100" fill={C.bluePale} />
      <circle cx="150" cy="120" r="75" fill={C.blueLight} opacity="0.4" />

      {/* Delivery van */}
      <g transform="translate(80,80)">
        {/* Van body */}
        <rect x="0" y="10" width="60" height="35" rx="6" fill={C.blue} />
        <rect x="0" y="10" width="60" height="10" rx="6" fill={C.blueDark} />
        {/* Cabin */}
        <rect x="60" y="18" width="25" height="27" rx="5" fill={C.slate} />
        <rect x="63" y="22" width="18" height="12" rx="2" fill={C.blueLight} />
        {/* Wheels */}
        <circle cx="18" cy="48" r="7" fill={C.slate} />
        <circle cx="18" cy="48" r="3" fill={C.grayLight} />
        <circle cx="72" cy="48" r="7" fill={C.slate} />
        <circle cx="72" cy="48" r="3" fill={C.grayLight} />
        {/* Package icon on van */}
        <rect x="12" y="18" width="14" height="12" rx="2" fill={C.orangeLight} />
        <rect x="30" y="20" width="10" height="8" rx="1.5" fill={C.orangeLight} />
        {/* Speed lines */}
        <line x1="-10" y1="22" x2="-2" y2="22" stroke={C.blue} strokeWidth="2" opacity="0.2" strokeLinecap="round" />
        <line x1="-15" y1="30" x2="-4" y2="30" stroke={C.blue} strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
        <line x1="-8" y1="38" x2="-1" y2="38" stroke={C.blue} strokeWidth="1.5" opacity="0.12" strokeLinecap="round" />
      </g>

      {/* Shield */}
      <g transform="translate(220,60)">
        <path d="M0 -20 L18 -10 L18 5 C18 15 0 25 0 25 C0 25 -18 15 -18 5 L-18 -10 Z" fill={C.green} opacity="0.9" />
        <path d="M-6 2 L-2 6 L8 -4" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Road */}
      <rect x="0" y="150" width="300" height="60" rx="0" fill={C.gray} />
      <line x1="20" y1="180" x2="50" y2="180" stroke={C.slateLight} strokeWidth="2" strokeDasharray="12 8" opacity="0.3" />
      <line x1="70" y1="180" x2="100" y2="180" stroke={C.slateLight} strokeWidth="2" strokeDasharray="12 8" opacity="0.3" />
      <line x1="120" y1="180" x2="150" y2="180" stroke={C.slateLight} strokeWidth="2" strokeDasharray="12 8" opacity="0.3" />
      <line x1="170" y1="180" x2="200" y2="180" stroke={C.slateLight} strokeWidth="2" strokeDasharray="12 8" opacity="0.3" />
      <line x1="220" y1="180" x2="250" y2="180" stroke={C.slateLight} strokeWidth="2" strokeDasharray="12 8" opacity="0.3" />

      {/* Floating GPS pin */}
      <g transform="translate(240,120)">
        <path d="M0 -12 C-7 -12 -12 -7 -12 0 C-12 10 0 20 0 20 C0 20 12 10 12 0 C12 -7 7 -12 0 -12 Z" fill={C.orange} opacity="0.2" />
        <circle cx="0" cy="-1" r="4" fill={C.orange} opacity="0.3" />
      </g>

      <circle cx="50" cy="70" r="5" fill={C.blue} opacity="0.12" />
      <circle cx="270" cy="160" r="4" fill={C.green} opacity="0.15" />
    </svg>
  );
}

export function QrCodeScanSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="150" cy="120" r="100" fill={C.bluePale} />
      <circle cx="150" cy="120" r="75" fill={C.blueLight} opacity="0.35" />

      {/* Person 1 - seller scanning */}
      <Person x={85} y={100} scale={1} shirtColor={C.shirt1} pantsColor={C.pants1} hairStyle="fade" armPose="scan" expression="smile" />

      {/* Person 2 - buyer showing QR */}
      <Person x={195} y={105} scale={0.95} shirtColor={C.shirt4} pantsColor={C.pants2} hairStyle="tresses" armPose="hold" expression="wink" />

      {/* Phone with QR code (buyer) */}
      <g transform="translate(210,78)">
        <rect x="-16" y="-22" width="32" height="44" rx="6" fill={C.slate} />
        <rect x="-13" y="-17" width="26" height="34" rx="3" fill={C.white} />
        {/* QR Code */}
        <rect x="-10" y="-14" width="20" height="20" rx="1" fill={C.white} stroke={C.gray} strokeWidth="0.5" />
        <rect x="-8" y="-12" width="6" height="6" rx="0.5" fill={C.slate} />
        <rect x="2" y="-12" width="6" height="6" rx="0.5" fill={C.slate} />
        <rect x="-8" y="0" width="6" height="6" rx="0.5" fill={C.slate} />
        <rect x="-2" y="-8" width="2" height="2" fill={C.slate} />
        <rect x="2" y="-2" width="4" height="2" fill={C.slate} />
        <rect x="-2" y="2" width="2" height="2" fill={C.slate} />
        {/* Scan line */}
        <line x1="-11" y1="-4" x2="11" y2="-4" stroke={C.green} strokeWidth="1.5" opacity="0.6" />
        {/* Green dot */}
        <circle cx="0" cy="12" r="4" fill={C.green} />
        <path d="M-2 12 L0 14 L3 10" stroke={C.white} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Connection beam */}
      <path d="M140 85 L195 78" stroke={C.green} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />

      {/* Floating check badges */}
      <g transform="translate(60,55)">
        <circle cx="0" cy="0" r="10" fill={C.green} opacity="0.12" />
        <path d="M-4 0 L-1 3 L5 -3" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      </g>

      <circle cx="255" cy="55" r="5" fill={C.blue} opacity="0.12" />
      <circle cx="45" cy="180" r="4" fill={C.orange} opacity="0.15" />
      <circle cx="260" cy="170" r="6" fill={C.green} opacity="0.1" />
    </svg>
  );
}

export function ExploreSearchSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="150" cy="120" r="100" fill={C.orangePale} />
      <circle cx="150" cy="120" r="75" fill={C.orangeLight} opacity="0.4" />

      <Person x={100} y={100} scale={1.1} shirtColor={C.shirt3} pantsColor={C.pants1} hairStyle="puff" armPose="phone" expression="wow" />

      {/* Magnifying glass */}
      <g transform="translate(195,70)">
        <circle cx="0" cy="0" r="28" fill={C.white} stroke={C.orange} strokeWidth="3" />
        <circle cx="0" cy="0" r="22" fill={C.orangePale} opacity="0.5" />
        <line x1="20" y1="20" x2="35" y2="35" stroke={C.orange} strokeWidth="5" strokeLinecap="round" />
        {/* Items inside */}
        <rect x="-12" y="-8" width="10" height="8" rx="2" fill={C.orange} opacity="0.3" />
        <rect x="2" y="-8" width="10" height="8" rx="2" fill={C.blue} opacity="0.2" />
        <rect x="-12" y="2" width="10" height="8" rx="2" fill={C.green} opacity="0.2" />
        <rect x="2" y="2" width="10" height="8" rx="2" fill={C.orange} opacity="0.25" />
      </g>

      {/* Floating product cards */}
      <g transform="translate(50,55)">
        <rect x="-16" y="-10" width="32" height="20" rx="5" fill={C.white} stroke={C.blueLight} strokeWidth="1.5" />
        <rect x="-12" y="-6" width="12" height="12" rx="2" fill={C.bluePale} />
        <rect x="4" y="-6" width="10" height="4" rx="1" fill={C.gray} />
        <rect x="4" y="0" width="7" height="3" rx="1" fill={C.gray} />
      </g>

      <g transform="translate(245,150)">
        <rect x="-14" y="-8" width="28" height="16" rx="4" fill={C.white} stroke={C.greenLight} strokeWidth="1.5" />
        <rect x="-10" y="-4" width="10" height="8" rx="2" fill={C.greenPale} />
        <rect x="4" y="-3" width="8" height="3" rx="1" fill={C.gray} />
        <rect x="4" y="2" width="5" height="2" rx="1" fill={C.gray} />
      </g>

      {/* Heart / favorite */}
      <g transform="translate(250,60)">
        <path d="M0 -6 C0 -10 -7 -10 -7 -4 C-7 2 0 8 0 8 C0 8 7 2 7 -4 C7 -10 0 -10 0 -6 Z" fill="#F43F5E" opacity="0.2" />
      </g>

      <circle cx="40" cy="180" r="5" fill={C.blue} opacity="0.12" />
      <circle cx="270" cy="100" r="4" fill={C.green} opacity="0.15" />
    </svg>
  );
}

export function ChatOfferSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="150" cy="120" r="100" fill={C.bluePale} />
      <circle cx="150" cy="120" r="75" fill={C.blueLight} opacity="0.35" />

      <Person x={90} y={105} scale={1} shirtColor={C.shirt1} pantsColor={C.pants2} hairStyle="tropics" armPose="chat" expression="smile" />

      {/* Chat bubbles */}
      <g transform="translate(190,60)">
        {/* Bubble 1 - buyer asking */}
        <rect x="-35" y="-15" width="70" height="28" rx="12" fill={C.blue} />
        <path d="M-20 13 L-25 22 L-12 13" fill={C.blue} />
        <text x="0" y="-1" textAnchor="middle" fontSize="6.5" fill={C.white} fontWeight="500">Négociable?</text>
        <text x="0" y="7" textAnchor="middle" fontSize="5.5" fill={C.white} opacity="0.8">Le prix?</text>
      </g>

      <g transform="translate(190,100)">
        {/* Bubble 2 - seller replying */}
        <rect x="-30" y="-12" width="60" height="24" rx="12" fill={C.grayLight} stroke={C.gray} strokeWidth="1" />
        <path d="M15 12 L22 20 L8 12" fill={C.grayLight} stroke={C.gray} strokeWidth="1" />
        <text x="0" y="-1" textAnchor="middle" fontSize="6" fill={C.slate}>Oui, 45 000F</text>
        <text x="0" y="7" textAnchor="middle" fontSize="5.5" fill={C.slateMid}>Je te le garde</text>
      </g>

      {/* Offer / Buy buttons */}
      <g transform="translate(155,145)">
        <rect x="-50" y="-12" width="45" height="24" rx="12" fill={C.green} />
        <text x="-27.5" y="1" textAnchor="middle" fontSize="6" fill={C.white} fontWeight="600">Offre</text>
        <rect x="5" y="-12" width="45" height="24" rx="12" fill={C.orange} />
        <text x="27.5" y="1" textAnchor="middle" fontSize="6" fill={C.white} fontWeight="600">Acheter</text>
      </g>

      {/* Floating $ signs */}
      <text x="48" y="55" fontSize="14" fill={C.orange} opacity="0.15" fontWeight="bold">$</text>
      <text x="260" y="110" fontSize="12" fill={C.orange} opacity="0.12" fontWeight="bold">$</text>

      <circle cx="45" cy="180" r="4" fill={C.blue} opacity="0.12" />
      <circle cx="260" cy="170" r="5" fill={C.green} opacity="0.12" />
    </svg>
  );
}

export function RdvsSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="150" cy="120" r="100" fill={C.greenPale} />
      <circle cx="150" cy="120" r="75" fill={C.greenLight} opacity="0.35" />

      {/* Building / partner location */}
      <g transform="translate(110,50)">
        <rect x="-35" y="0" width="70" height="65" rx="6" fill={C.grayLight} stroke={C.gray} strokeWidth="1" />
        <rect x="-35" y="-5" width="70" height="14" rx="6" fill={C.slate} />
        {/* Windows */}
        <rect x="-26" y="8" width="12" height="10" rx="2" fill={C.blueLight} />
        <rect x="-10" y="8" width="12" height="10" rx="2" fill={C.blueLight} />
        <rect x="14" y="8" width="12" height="10" rx="2" fill={C.blueLight} />
        <rect x="-26" y="24" width="12" height="10" rx="2" fill={C.blueLight} />
        <rect x="14" y="24" width="12" height="10" rx="2" fill={C.blueLight} />
        {/* Door */}
        <rect x="-8" y="40" width="16" height="25" rx="3" fill={C.orange} />
        <circle cx="5" cy="54" r="1.5" fill={C.orangeDark} />
        {/* AK sign */}
        <rect x="-20" y="-3" width="40" height="5" rx="1" fill={C.orange} opacity="0.6" />
      </g>

      {/* Person left */}
      <Person x={65} y={110} scale={0.85} shirtColor={C.shirt1} pantsColor={C.pants1} hairStyle="short" armPose="down" expression="smile" />

      {/* Person right */}
      <Person x={210} y={110} scale={0.85} shirtColor={C.shirt3} pantsColor={C.pants2} hairStyle="puff" armPose="down" expression="happy" />

      {/* Shield */}
      <g transform="translate(245,55)">
        <path d="M0 -14 L12 -7 L12 3 C12 10 0 17 0 17 C0 17 -12 10 -12 3 L-12 -7 Z" fill={C.green} />
        <path d="M-4 1 L-1 4 L5 -2" stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Ground */}
      <rect x="0" y="160" width="300" height="60" fill={C.gray} />

      {/* Floating elements */}
      <circle cx="40" cy="55" r="4" fill={C.blue} opacity="0.12" />
      <circle cx="270" cy="130" r="5" fill={C.orange} opacity="0.12" />
      <circle cx="50" cy="190" r="4" fill={C.green} opacity="0.15" />
    </svg>
  );
}

export function HandToHandSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="150" cy="120" r="100" fill={C.orangePale} />
      <circle cx="150" cy="120" r="75" fill={C.orangeLight} opacity="0.4" />

      {/* Person left */}
      <Person x={95} y={100} scale={1.05} shirtColor={C.shirt2} pantsColor={C.pants1} hairStyle="fade" armPose="hold" expression="happy" />

      {/* Person right */}
      <Person x={195} y={100} scale={1.05} shirtColor={C.shirt4} pantsColor={C.pants2} hairStyle="tresses" armPose="hold" expression="smile" />

      {/* Package being exchanged */}
      <g transform="translate(145,95)">
        <rect x="-16" y="-12" width="32" height="24" rx="5" fill={C.orange} />
        <rect x="-16" y="-12" width="32" height="6" rx="5" fill={C.orangeDark} />
        <rect x="-2" y="-12" width="4" height="24" fill={C.orangeLight} opacity="0.3" />
        {/* Ribbon */}
        <rect x="-16" y="-2" width="32" height="3" fill={C.orangeLight} opacity="0.25" />
      </g>

      {/* QR Code floating above */}
      <g transform="translate(145,50)">
        <rect x="-20" y="-14" width="40" height="28" rx="4" fill={C.white} stroke={C.green} strokeWidth="2" />
        <rect x="-14" y="-10" width="8" height="8" rx="1" fill={C.slate} />
        <rect x="6" y="-10" width="8" height="8" rx="1" fill={C.slate} />
        <rect x="-14" y="2" width="8" height="8" rx="1" fill={C.slate} />
        <rect x="-2" y="-6" width="4" height="4" fill={C.slate} />
        <rect x="6" y="2" width="4" height="4" fill={C.slate} />
        <rect x="-2" y="6" width="4" height="4" fill={C.slate} />
        {/* Check */}
        <circle cx="16" cy="-14" r="8" fill={C.green} />
        <path d="M13 -14 L15 -12 L19 -16" stroke={C.white} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Ground */}
      <rect x="0" y="160" width="300" height="60" fill={C.gray} />

      <circle cx="40" cy="60" r="5" fill={C.blue} opacity="0.12" />
      <circle cx="265" cy="80" r="4" fill={C.green} opacity="0.15" />
      <circle cx="50" cy="190" r="4" fill={C.orange} opacity="0.12" />
    </svg>
  );
}
