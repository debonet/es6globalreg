const Mutex = require( "@debonet/es6mutex" );

function faGR(){
	return global[ "@debonet/es6globalreg" ] ??= { mutex : new Mutex(), aRegistry: {} };
}

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
async function fpxGet( s, fxNew ){
	const aGR = faGR();
	const aReg = aGR.aRegistry;
	
	if ( !aReg[ s ] ){
		await aGR.mutex.criticalSection(()=> {
			aReg[ s ] = { x : fxNew(), c : 0 };
		});
	}

	aReg[ s ].c++;
	return aReg[ s ].x;
}

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
async function fpRelease( x, fClean = () => {}, bAll = false ){
	const aGR = faGR();
	const aReg = aGR.aRegistry;
	
	for ( let s in aReg ){
		if ( aReg[ s ].x === x ){
			aReg[ s ].c--;
			const c = aReg[ s ].c;

			if ( aReg[ s ].c <= 0 || bAll ){
				await aGR.mutex.criticalSection(()=> {
					fClean();
					delete aReg[ s ];
				});
			}

			return c;
		}
	}
}

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
async function fpReleaseAll( x, fClean = () => {} ){
	return fpRelease( x, fClean, true );
}

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
function fcInstances( x ){
	const aGR = faGR();
	const aReg = aGR.aRegistry;

	for ( let s in aReg ){
		if ( aReg[ s ].x === x ){
			return aReg[ s ].c;
		}
	}
	return 0;
}

module.exports = {
	fpxGet,
	fpRelease,
	fpReleaseAll,
	fcInstances,
	
	get : fpxGet,
	release : fpRelease,
	releaseAll : fpReleaseAll,
	instances : fcInstances,
}

