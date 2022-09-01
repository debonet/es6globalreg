const Condition = require( "@debonet/es6condition" );

function faGlobalReg(){
	return global[ "@debonet/es6globalreg" ] ??= { };
}

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
async function fpxGet( s, fxNew ){
	const aReg = faGlobalReg();
	
	if ( !aReg[ s ] ){
		aReg[ s ] = { cond : new Condition(), c : 0 };
		aReg[ s ].x = await fxNew();
		aReg[ s ].c = 1;
		aReg[ s ].cond.broadcast();
		return aReg[ s ].x;
	}
	else{
		if ( aReg[ s ].c == 0 ){
			await aReg[ s ].cond.wait();
		}
		
		aReg[ s ].c++;
		return aReg[ s ].x;
	}
}

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
async function fpRelease( x, fClean = () => {}, bAll = false ){
	const aReg = faGlobalReg();
	
	for ( let s in aReg ){
		if ( aReg[ s ].x === x ){
			aReg[ s ].c--;
			const c = aReg[ s ].c;
			
			if ( c <= 0 || bAll ){
				delete aReg[ s ];
				return await fClean();
			}

			return { "globalreg" : c };
		}
	}
	
	throw( new Error( "unknown global registry element" ));
}

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
async function fpReleaseAll( x, fClean = () => {} ){
	return fpRelease( x, fClean, true );
}

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
function fcInstances( x ){
	const aReg = faGlobalReg();

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

