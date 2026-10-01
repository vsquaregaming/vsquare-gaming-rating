// Review text generator for Vsquare Gaming.
//
// Templates use a tiny grammar:
//   {a|b|c}  pick one option at random (options may be empty, and may nest)
// Every sentence has several slots, every pool has many sentences, and a final
// "humanize" pass varies punctuation and casing. The result is billions of
// possible reviews, so two customers practically never get the same text.
// Rules for writing templates: plain casual English, no emoji, no hype words
// ("top-notch", "must-visit", "seamless", "vibrant", "immersive", "elevate").

(function (root) {
  const rnd = Math.random;
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const chance = (p) => rnd() < p;
  const shuffle = (a) => a.map((v) => [rnd(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);

  // Expand {a|b|{c|d}} recursively.
  function expand(t) {
    return expandRaw(t).replace(/\s+/g, " ").replace(/\s+([,.!])/g, "$1").trim();
  }
  function expandRaw(t) {
    let out = "", i = 0;
    while (i < t.length) {
      if (t[i] !== "{") { out += t[i++]; continue; }
      let depth = 1, j = i + 1, opts = [], start = j;
      for (; j < t.length && depth; j++) {
        if (t[j] === "{") depth++;
        else if (t[j] === "}") { if (--depth === 0) opts.push(t.slice(start, j)); }
        else if (t[j] === "|" && depth === 1) { opts.push(t.slice(start, j)); start = j + 1; }
      }
      out += expandRaw(pick(opts));
      i = j;
    }
    return out;
  }

  // ---------- Openers ----------
  const OPEN = {
    5: [
      "{Really|Honestly|Genuinely} {loved|enjoyed} {this place|my time here|playing here|my session here}.",
      "{One of the best|Probably the best|Easily the best|Best} gaming {cafe|spot|place|zone} {in Saket|around Saket|in this area|I've been to|in South Delhi}.",
      "{Finally|Recently} {tried|checked out|went to} {Vsquare|this place|Vsquare Gaming} and {it was totally worth it|it did not disappoint|I'm glad I did|loved it}.",
      "{Went here|Came here|Visited} {with friends|with my friends|with a couple of friends|with my cousins} {last weekend|recently|the other day|on Sunday} and {had a great time|had so much fun|we had a blast|we didn't want to leave}.",
      "{Such a|Really|Very} {good|nice|fun|chill} place to {game|play|chill and play|spend a few hours}.",
      "{If you're|For anyone} {looking for|searching for} a {good|proper|decent|solid} gaming {cafe|place|zone} {in Saket|nearby|in South Delhi|around here}, {this is it|go here|try Vsquare|look no further}.",
      "{Great|Amazing|Awesome|Superb} {experience|time} at Vsquare{ Gaming|}.",
      "{Been here|Have been here} {a few times|twice now|multiple times|3-4 times} and {it's always good|never been disappointed|it's become our regular spot|it never gets old}.",
      "{Didn't expect much|Wasn't expecting much} {but|honestly but} {this place|Vsquare} {surprised me|turned out really good|was way better than I thought}.",
      "{My|Our} {go-to|favourite|regular} gaming {spot|place|cafe} {now|for sure|in the area}.",
    ],
    4: [
      "{Really|Pretty} {good|nice|solid} {experience|time} at Vsquare{ Gaming|}.",
      "{Good|Nice|Decent} gaming {cafe|place|spot} {in Saket|in the area|nearby}.",
      "{Had a good time|Enjoyed my visit|Had fun} {here|at Vsquare}{ with friends| last week|}.",
      "{Went|Came} here {recently|last weekend|with a friend} and {liked it|it was good|had a nice time}.",
      "{Overall|All in all} a {good|nice|solid} {place|spot} to {game|play|spend a few hours}.",
    ],
    3: [
      "{Decent|Okay|Average} {place|experience|gaming cafe}{ overall|}.",
      "{It's|The place is} {okay|alright|fine} for {a quick session|casual gaming|a couple of hours}.",
      "{Mixed|So-so} experience {here|at Vsquare|this time}.",
      "{Visited|Went} {recently|last week} and it was {okay|average|fine, nothing special}.",
      "{Not bad|Not great, not bad}{, just average| honestly|}.",
      "{Had|It was} {an okay|an average|a so-so} {time|experience|visit} {here|at Vsquare}{ overall|}.",
      "{Came|Went} {here|to Vsquare} {after seeing the ratings|on a friend's suggestion|for a couple of hours} and it was {just okay|average}.",
    ],
    2: [
      "{Not|Wasn't} {a great|the best} experience {this time|on my visit|here}.",
      "{Visited|Went} {recently|last week} and {was a bit disappointed|it was below what I expected}.",
      "{Expected|Was expecting} {more|better} {from this place|honestly}.",
      "{Came|Went} {here|to Vsquare} {after seeing the ratings|on a friend's suggestion|for a couple of hours} and {it wasn't great|was a bit let down}.",
      "{Not happy|Not satisfied} with {my visit|the experience}{ this time| honestly|}.",
    ],
    1: [
      "{Really|Pretty} {disappointed|unhappy} with {my visit|this place|the experience}.",
      "{Bad|Not good} experience {this time|on my visit|honestly}.",
      "{Unfortunately|Sadly} {my visit|the experience} {wasn't good|was disappointing}.",
      "{Came|Went} {here|to Vsquare} {after seeing the ratings|on a friend's suggestion} and {regretted it|was really let down}.",
      "{Would not|Wouldn't} {recommend|go back}{ based on my visit| honestly|}.",
    ],
  };

  // ---------- Topic sentences ----------
  const LINES = {
    consoles: {
      pos: [
        "{The|Their} {PCs|setups|systems} are {really|pretty|super} {smooth|fast|good}{, no lag at all| and run without any lag|}.",
        "{Good|Solid|High end|Proper} {PCs|gaming PCs|setups} {with|and} {big screens|good monitors|good headsets|high refresh monitors}.",
        "{Controllers|The controllers} {were in good condition|worked perfectly|felt brand new}{, which is rare| which isn't always the case at gaming cafes|}.",
        "{Games ran|Everything ran} {smooth|smoothly} {on high settings|even on high graphics|without any frame drops}.",
        "{No lag|Zero lag|No frame drops} {at all|even in online matches|during the whole session}{, the systems are really good|}.",
      ],
      mid: [
        "{The|Our} {system|PC|console} {was|felt} {okay|fine}{ but not the best| for casual games|}.",
        "{Setups|Systems} are {decent|okay}{ but a couple of controllers need replacing| though one or two stations felt a bit slow|}.",
        "{PCs|Consoles} {work fine|are fine} {mostly|overall}{, nothing too fancy|}.",
      ],
      neg: [
        "{Faced|Had} {lag|connection issues|controller issues} {in the middle of|during} {our game|a match|the session}.",
        "{Our|My} {system|station|controller} {kept lagging|wasn't working properly|had issues} {the whole time|for a while}.",
        "{Some|A few} {controllers|systems} {need maintenance|weren't working}.",
      ],
    },
    games: {
      pos: [
        "{They have|There's} {a good|a solid|a big|a nice} {collection|variety|range} of games{, both PC and console| for every type of gamer| including the new ones|}.",
        "{All the|Most of the} {popular|latest|new} games are {installed|available|there}{ and updated| already|}.",
        "{Played|We played} {a bit of everything|a lot of different games|multiplayer for hours} and {never got bored|there was always something new to try}.",
      ],
      mid: [
        "{Had|Found} {most|some} of the games I wanted{, not all|, a few were missing|}.",
        "{Game|Games} {selection|library} is {okay|decent}{, would like a few more new releases| but missing some titles I wanted|}.",
      ],
      neg: [
        "{Couldn't|Could not} find {the game|the games} {I wanted|we wanted} to play.",
        "{Not many|Limited} {games|options} {to choose from|available}{ compared to other places|}.",
      ],
    },
    vibe: {
      pos: [
        "{Loved|Really liked} the {cloud lights on the ceiling|ceiling lights|lighting setup}{, gives it a proper gaming feel|, looks really cool|}.",
        "{The|Their} {sofas|seats|chairs} are {super comfy|really comfortable|comfy}{, you can play for hours| so long sessions are easy|}.",
        "{Nice|Chill|Cool|Good} {vibe|atmosphere|setup}{ overall| and not too loud| to unwind after college| to unwind after work|}.",
        "{The interior|The place|The whole setup} {looks|is} {really|very|super} {cool|nice|well done}.",
      ],
      mid: [
        "{Seating|Space} is {okay|fine}{, could be more comfortable|, a bit cramped|}.",
        "{The vibe is nice|Atmosphere is fine} {but|though} it {gets crowded|gets a bit loud} {in the evenings|on weekends}.",
      ],
      neg: [
        "{Seating|The seats} {wasn't|weren't} {comfortable|great} for {long sessions|a few hours}.",
        "{It was|The place was} {too crowded|very noisy|too hot} {when I went|that day}.",
      ],
    },
    staff: {
      pos: [
        "{Staff|The staff|The guys at the counter} {are|were} {really|very|super} {friendly|helpful|chill}{ and helped us set everything up| and quick to sort things out|}.",
        "{The owner|The staff} {is|was} {very|really} {friendly|welcoming}{, you can tell they love gaming| and genuinely cares about the experience|}.",
        "{Good|Great|Quick} service{, they helped with game settings too| and no waiting around|}.",
      ],
      mid: [
        "{Staff|The staff} {was|were} {okay|fine}{, nothing special|, could be more helpful|}.",
        "{Staff are|Staff was} {polite|okay} {but|though} {a bit slow when it's busy|not always around}.",
      ],
      neg: [
        "{Had to|We had to} {wait|ask} {a while|multiple times} for {help|someone to sort it out}.",
        "{Staff|The staff} {wasn't|weren't} {very helpful|very attentive}{ when we had an issue|}.",
      ],
    },
    price: {
      pos: [
        "{Prices are|Pricing is|Rates are} {very|really|pretty} {reasonable|affordable|pocket friendly}{ for the setup you get| compared to other places| for students|}.",
        "{Totally|Completely} {value for money|worth the money}{ honestly|}.",
        "{Didn't|Did not} {burn a hole in my pocket|cost much}{ even after a long session| for a few hours of gaming|}.",
      ],
      mid: [
        "{Rates|Prices} are {alright|okay} for {a short session|an hour or two}.",
        "{Prices are|Pricing is} {okay|fair}{, some combo or hourly deals would be nice|, a little on the higher side|}.",
      ],
      neg: [
        "{Rates|Prices} are {too high|on the higher side} {for what you get|compared to other places}.",
        "{Felt|Found it} {a bit|quite} {overpriced|expensive} for {what we got|the experience}.",
      ],
    },
    clean: {
      pos: [
        "{The place is|Everything is|It's} {clean|neat|well maintained}{ and well kept| and hygienic|, even the headsets|}.",
        "{Clean|Neat|Tidy} {setup|place|space}{, which I really appreciated|, controllers and seats are kept clean|}.",
      ],
      mid: [
        "{Could be|Can be} {cleaner|a bit cleaner}{, especially the controllers| in some areas|}.",
        "{Mostly|Fairly} clean{, the seating area could be better|, could be a little better|}.",
      ],
      neg: [
        "{Controllers|Headsets|Seats} {weren't|were not} {very clean|clean}{ when we went|}.",
        "{Cleanliness|Hygiene} {needs work|could be much better}.",
      ],
    },
    friends: {
      pos: [
        "{Perfect|Great|Best} {place|spot} to {hang out|chill|play} with {friends|the squad|the gang}.",
        "{We|Me and my friends} {spent|played for} {hours|the whole evening|a good 3 hours} {on multiplayer|playing together|here}{ and had a blast| and didn't want to leave|}.",
        "{Good|Great} for {group sessions|playing with friends|multiplayer}{, enough setups for all of us| since they have enough systems|}.",
      ],
      mid: [
        "{Okay|Decent} for {a group|friends}{, though we had to wait for systems|}.",
        "{Fun|Okay} with friends{ but getting systems together took a while|}.",
      ],
      neg: [
        "{Not|Wasn't} {great|ideal} for {a group|friends}{, not enough systems free|}.",
        "{Getting|Booking} {systems|stations} together for {our group|all of us} was {a hassle|difficult}.",
      ],
    },
    snacks: {
      pos: [
        "{You can|They let you} {order|grab} {snacks|drinks|snacks and drinks} {while playing|between games|on the side}{, which is a plus|, which is nice|}.",
        "{Snacks|Cold drinks|Snacks and drinks} {available|are available} {too|as well}{, so no need to step out|}.",
      ],
      mid: [
        "{Snacks|Drinks} are {there|available} but {limited|a bit pricey}.",
        "{Snack|Food} options are {limited|basic}{ but okay|}.",
      ],
      neg: [
        "{No|Barely any} {proper|decent} {snacks|food} {available|to order}.",
        "{Hardly any|Very limited} {snack|food} options.",
      ],
    },
  };

  // Generic sentences that make no specific claim. Used to vary length and
  // structure, especially when the customer ticks only one highlight.
  const FILLER = {
    pos: [
      "{Smooth|Lag free} gameplay, {comfy|comfortable} seating and {a good|a chill|a nice} vibe.",
      "{Everything|The whole experience} {was|felt} {well managed|sorted|easy} from {start to end|the moment we walked in}.",
      "{Had|We had} {a really good|a great|a fun} {time|session|evening} {overall|here|playing}.",
      "{Time|The hours} {flew by|went by so fast}{ while playing| honestly|}.",
      "{It's|This is} {exactly|just} what a gaming {cafe|place} {should be|needs to be}.",
      "{Way|Much} better than {other|most} gaming cafes {I've tried|around|I've been to}.",
      "{Good|Great|Nice} place {to destress|to unwind|to kill time} {after college|after work|on weekends|on a day off}.",
      "{No complaints|Nothing to complain about}{ at all| honestly| really|}.",
      "{Overall|All in all} {a really|a very|a super} {good|fun|enjoyable} {experience|time|visit}.",
    ],
    mid: [
      "{Some things were good|A few things were nice}, {some|others} {could be better|need work}.",
      "{Not bad|Not too bad} {overall|for the price}{, just a few things to fix|}.",
      "{Good|Fine} for {a casual|a quick} {session|game}{ but not much more|}.",
      "{It was|The experience was} {alright|okay}{, nothing too special|, had its ups and downs|}.",
      "{Has|There's} {potential|good potential}{, just needs some work| if they fix a few things|}.",
    ],
    neg: [
      "{There's|There is} {a lot of|quite a bit of} room for improvement.",
      "{Not|Didn't feel} worth {the money|it} {this time|honestly|for me}.",
      "{Didn't|Did not} {enjoy|like} {the experience|my time} {much|as much as I hoped}.",
      "{Expected|Was expecting} {a lot|much} better{ given the ratings| from the reviews|}.",
      "{Things|Stuff} {need|really need} to {improve|get better}{ here| honestly|}.",
    ],
  };

  // Mild nitpick for some 4-star reviews, so they read like real 4s.
  const NITPICK = [
    "{Only thing|One small thing} {is|was} it gets {a bit crowded|busy} on weekends{, but still worth it|, otherwise all good|}.",
    "{Wish|Would be nice if} they had {a couple more systems|a few more new games}{, otherwise all good|}.",
    "{Took|It took} a {few minutes|little while} to get a system{ on a weekend|}, {but|though} {worth the wait|no big deal}.",
  ];

  const CLOSE = {
    5: [
      "{Will|Would} {definitely|surely|100%} {come back|be back|visit again}{ soon| with more friends|}.",
      "{Highly|Totally|Strongly} recommend{ it| this place|}.",
      "{Recommended|Must try} for {every gamer|all gamers|anyone into gaming|anyone nearby}.",
      "{Already planning|Can't wait for} my next {visit|session}.",
      "{Go|Do check it out} if you're {nearby|in Saket|around}.",
      "{5 stars|Five stars} from {me|my side}.",
      "Keep it up{ guys| team|}.",
      "Full paisa vasool.",
    ],
    4: [
      "{Would|Will} {recommend|visit again}.",
      "{Good|Nice} place overall{, will come again|}.",
      "{Worth|Definitely worth} {a visit|checking out}.",
    ],
    3: [
      "{Might|May} {come back|visit again} {if things improve|sometime}.",
      "{Worth a try|Okay for a try} if you're {nearby|around}.",
      "{Hope|Hoping} {it gets better|they improve}{ next time| soon|}.",
      "{Overall|All in all} {okay|average|decent}{, nothing more|}.",
    ],
    2: [
      "{Hope|Hoping} they {work on this|improve these things}.",
      "{Hope|Hoping} for a better experience next time.",
      "{Not sure|Don't think} I'll {come back|visit again}{ soon| honestly|}.",
      "{Please|Kindly} {look into|work on} {this|these issues}.",
    ],
    1: [
      "{Hope|I hope} the {management|owner} {looks into this|fixes these issues}.",
      "{Needs|Really needs} {improvement|work}.",
      "{Won't|Will not} be {coming back|visiting again}{ honestly| unless things change|}.",
      "{Very|Really} {disappointing|let down}{ overall| honestly|}.",
    ],
  };

  const toneFor = (r) => (r >= 4 ? "pos" : r === 3 ? "mid" : "neg");

  // ---------- Humanize ----------
  const KEEP_CAPS = /^(I\b|I'|Vsquare|Saket|South|Sunday|PC)/;
  function lowerFirst(s) { return KEEP_CAPS.test(s) ? s : s[0].toLowerCase() + s.slice(1); }

  function humanize(sentences, r) {
    const s = sentences.slice();
    // Sometimes join two sentences the way people type.
    if (s.length > 2 && chance(0.3)) {
      const i = 1 + Math.floor(rnd() * (s.length - 2));
      const glue = pick([", ", ", ", " - "]);
      s.splice(i, 2, s[i].replace(/[.!]$/, "") + glue + lowerFirst(s[i + 1]));
    }
    // One exclamation on happy reviews.
    if (r >= 4 && chance(0.4)) {
      const i = Math.floor(rnd() * s.length);
      s[i] = s[i].replace(/\.$/, "!");
    }
    let text = s.join(" ");
    if (chance(0.15)) text = text.replace(/ and /, " & ");
    if (chance(0.3)) text = text.replace(/[.!]$/, "");     // many people skip the last full stop
    if (chance(0.1)) text = lowerFirst(text);
    return text;
  }

  // ---------- Generate ----------
  function generate(rating, topics) {
    const r = Math.max(1, Math.min(5, rating));
    const tone = toneFor(r);
    const chosen = topics && topics.length
      ? shuffle(topics).slice(0, 4)
      : shuffle(Object.keys(LINES)).slice(0, 1 + Math.floor(rnd() * 2));

    const body = chosen.map((t) => expand(pick(LINES[t][tone])));
    const target = 2 + Math.floor(rnd() * 3); // 2-4 body sentences
    const fillers = shuffle(FILLER[tone]);
    while (body.length < target && fillers.length) body.splice(Math.floor(rnd() * (body.length + 1)), 0, expand(fillers.pop()));
    if (r === 4 && chance(0.4)) body.push(expand(pick(NITPICK)));

    const parts = [];
    if (chance(0.85)) parts.push(expand(pick(OPEN[r])));
    parts.push(...body);
    if (chance(0.85)) parts.push(expand(pick(CLOSE[r])));
    return humanize(parts, r);
  }

  // ---------- Per-device duplicate guard ----------
  const KEY = "vsq_generated";
  function seen() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } }
  function remember(text) {
    try { localStorage.setItem(KEY, JSON.stringify([text, ...seen()].slice(0, 100))); } catch {}
  }
  function generateUnique(rating, topics) {
    const past = new Set(seen());
    let text;
    for (let i = 0; i < 25; i++) {
      text = generate(rating, topics);
      if (!past.has(text)) break;
    }
    remember(text);
    return text;
  }

  const api = { generate, generateUnique, expand };
  if (typeof module !== "undefined") module.exports = api;
  else root.ReviewGen = api;
})(this);
