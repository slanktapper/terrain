var controls;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    100000
);


var cameraSpeedFactor = .1

var nodeGeometry = new THREE.SphereGeometry( .2, .2, .2 );
var color = Math.random()*16777215;
var nodeMaterial = new THREE.MeshBasicMaterial( { color: 0x00cc00 } );
var lineMaterial = new THREE.LineBasicMaterial( { color: 0x00f0ff});
var viewframeGridMaterial = new THREE.LineBasicMaterial( { color: 0xff6600});
var drawNodes = false;
var animatedLineSpacing = 5;
var wireframeResolutionFactor = 5;

/*
    Terrain rendering configuration
*/

var nodeSpacingFactor = 2
var heightOffset = -1800
var heightFactor = .8



/*
    This is some elevation data generated by terrain.py -- currently we just
    slam against the GeoGratis API but eventually we want to store the full
    elevation data locally
*/

var sampleData = [
    [2108.0, 2101.0, 2094.0, 2088.0, 2093.0, 2084.0, 2079.0, 2074.0, 2068.0, 2061.0, 2053.0, 2045.0, 2035.0, 2025.0, 2013.0, 2000.0, 1987.0, 1972.0, 1941.0, 1924.0],
    [2125.0, 2118.0, 2111.0, 2106.0, 2101.0, 2096.0, 2086.0, 2079.0, 2072.0, 2065.0, 2055.0, 2044.0, 2034.0, 2022.0, 2010.0, 1996.0, 1981.0, 1966.0, 1949.0, 1913.0],
    [2135.0, 2128.0, 2121.0, 2115.0, 2109.0, 2102.0, 2087.0, 2078.0, 2069.0, 2058.0, 2048.0, 2037.0, 2025.0, 2013.0, 2000.0, 1986.0, 1971.0, 1939.0, 1922.0, 1885.0],
    [2137.0, 2130.0, 2122.0, 2114.0, 2105.0, 2096.0, 2074.0, 2061.0, 2048.0, 2034.0, 2021.0, 2008.0, 1995.0, 1981.0, 1967.0, 1952.0, 1936.0, 1919.0, 1902.0, 1866.0],
    [2137.0, 2129.0, 2120.0, 2111.0, 2101.0, 2089.0, 2077.0, 2034.0, 2018.0, 2001.0, 1985.0, 1970.0, 1955.0, 1940.0, 1925.0, 1909.0, 1892.0, 1876.0, 1859.0, 1842.0],
    [2132.0, 2123.0, 2112.0, 2100.0, 2086.0, 2072.0, 2056.0, 2020.0, 2002.0, 1984.0, 1968.0, 1951.0, 1936.0, 1920.0, 1885.0, 1869.0, 1852.0, 1836.0, 1819.0, 1804.0],
    [2122.0, 2111.0, 2098.0, 2084.0, 2069.0, 2052.0, 2034.0, 2014.0, 1974.0, 1955.0, 1937.0, 1919.0, 1902.0, 1885.0, 1869.0, 1852.0, 1835.0, 1819.0, 1804.0, 1789.0],
    [2115.0, 2103.0, 2090.0, 2075.0, 2049.0, 2032.0, 2013.0, 1992.0, 1952.0, 1932.0, 1913.0, 1895.0, 1877.0, 1859.0, 1842.0, 1825.0, 1809.0, 1793.0, 1779.0, 1766.0],
    [2099.0, 2086.0, 2072.0, 2056.0, 2039.0, 2022.0, 2002.0, 1982.0, 1941.0, 1922.0, 1892.0, 1873.0, 1855.0, 1837.0, 1820.0, 1803.0, 1788.0, 1774.0, 1762.0, 1751.0],
    [2082.0, 2068.0, 2053.0, 2037.0, 2020.0, 2002.0, 1983.0, 1963.0, 1942.0, 1902.0, 1882.0, 1863.0, 1845.0, 1827.0, 1810.0, 1795.0, 1780.0, 1761.0, 1751.0, 1742.0],
    [2074.0, 2052.0, 2036.0, 2019.0, 2001.0, 1982.0, 1963.0, 1943.0, 1923.0, 1883.0, 1864.0, 1846.0, 1828.0, 1811.0, 1795.0, 1781.0, 1768.0, 1757.0, 1747.0, 1739.0],
    [2060.0, 2044.0, 2027.0, 2010.0, 1992.0, 1973.0, 1954.0, 1925.0, 1905.0, 1867.0, 1849.0, 1831.0, 1815.0, 1800.0, 1786.0, 1773.0, 1762.0, 1753.0, 1745.0, 1738.0],
    [2046.0, 2030.0, 2012.0, 1994.0, 1975.0, 1956.0, 1937.0, 1917.0, 1898.0, 1879.0, 1843.0, 1826.0, 1810.0, 1796.0, 1781.0, 1770.0, 1761.0, 1753.0, 1746.0, 1739.0],
    [2036.0, 2020.0, 2003.0, 1985.0, 1966.0, 1948.0, 1929.0, 1910.0, 1891.0, 1873.0, 1838.0, 1822.0, 1807.0, 1794.0, 1782.0, 1771.0, 1762.0, 1754.0, 1747.0, 1740.0],
    [2034.0, 2019.0, 2003.0, 1985.0, 1971.0, 1954.0, 1935.0, 1917.0, 1899.0, 1880.0, 1845.0, 1829.0, 1813.0, 1799.0, 1787.0, 1776.0, 1767.0, 1759.0, 1751.0, 1744.0],
    [2037.0, 2025.0, 2011.0, 1995.0, 1979.0, 1961.0, 1944.0, 1925.0, 1907.0, 1889.0, 1870.0, 1843.0, 1825.0, 1810.0, 1796.0, 1784.0, 1774.0, 1765.0, 1756.0, 1749.0],
    [2045.0, 2036.0, 2025.0, 2012.0, 1997.0, 1981.0, 1964.0, 1946.0, 1927.0, 1908.0, 1889.0, 1850.0, 1832.0, 1815.0, 1801.0, 1789.0, 1778.0, 1771.0, 1762.0, 1755.0],
    [2048.0, 2046.0, 2037.0, 2026.0, 2013.0, 1997.0, 1981.0, 1962.0, 1943.0, 1923.0, 1903.0, 1862.0, 1843.0, 1825.0, 1810.0, 1797.0, 1785.0, 1774.0, 1765.0, 1757.0],
    [2050.0, 2047.0, 2041.0, 2030.0, 2017.0, 2002.0, 1985.0, 1970.0, 1951.0, 1931.0, 1910.0, 1890.0, 1851.0, 1833.0, 1818.0, 1804.0, 1792.0, 1781.0, 1772.0, 1764.0],
    [2046.0, 2046.0, 2041.0, 2033.0, 2020.0, 2005.0, 1988.0, 1970.0, 1951.0, 1932.0, 1912.0, 1892.0, 1854.0, 1837.0, 1826.0, 1812.0, 1800.0, 1789.0, 1779.0, 1771.0],
    [2038.0, 2041.0, 2038.0, 2030.0, 2017.0, 2003.0, 1986.0, 1969.0, 1951.0, 1932.0, 1913.0, 1895.0, 1860.0, 1844.0, 1830.0, 1816.0, 1804.0, 1793.0, 1783.0, 1774.0],
    [2034.0, 2038.0, 2035.0, 2027.0, 2012.0, 1998.0, 1982.0, 1966.0, 1949.0, 1931.0, 1914.0, 1897.0, 1881.0, 1850.0, 1836.0, 1823.0, 1810.0, 1799.0, 1789.0, 1780.0],
    [2023.0, 2029.0, 2027.0, 2020.0, 2009.0, 1995.0, 1980.0, 1964.0, 1947.0, 1931.0, 1914.0, 1898.0, 1882.0, 1853.0, 1840.0, 1827.0, 1815.0, 1804.0, 1794.0, 1786.0],
    [1995.0, 2017.0, 2017.0, 2012.0, 2002.0, 1989.0, 1975.0, 1960.0, 1944.0, 1928.0, 1913.0, 1897.0, 1882.0, 1868.0, 1841.0, 1829.0, 1817.0, 1809.0, 1799.0, 1791.0],
    [1987.0, 2004.0, 2006.0, 2002.0, 1994.0, 1983.0, 1970.0, 1956.0, 1941.0, 1926.0, 1911.0, 1896.0, 1882.0, 1868.0, 1843.0, 1832.0, 1821.0, 1811.0, 1802.0, 1794.0],
    [1969.0, 1996.0, 2000.0, 1997.0, 1990.0, 1980.0, 1968.0, 1953.0, 1939.0, 1925.0, 1911.0, 1897.0, 1883.0, 1870.0, 1847.0, 1836.0, 1826.0, 1817.0, 1808.0, 1800.0],
    [1947.0, 1966.0, 1984.0, 1984.0, 1981.0, 1974.0, 1965.0, 1953.0, 1940.0, 1926.0, 1912.0, 1898.0, 1885.0, 1872.0, 1864.0, 1843.0, 1833.0, 1824.0, 1815.0, 1807.0],
    [1921.0, 1941.0, 1965.0, 1971.0, 1972.0, 1970.0, 1964.0, 1954.0, 1942.0, 1929.0, 1915.0, 1902.0, 1890.0, 1878.0, 1867.0, 1846.0, 1836.0, 1827.0, 1818.0, 1810.0],
    [1908.0, 1928.0, 1945.0, 1965.0, 1965.0, 1967.0, 1963.0, 1955.0, 1945.0, 1932.0, 1920.0, 1908.0, 1896.0, 1885.0, 1874.0, 1854.0, 1844.0, 1834.0, 1825.0, 1816.0],
    [1883.0, 1904.0, 1924.0, 1952.0, 1960.0, 1964.0, 1961.0, 1954.0, 1945.0, 1934.0, 1922.0, 1913.0, 1903.0, 1892.0, 1882.0, 1872.0, 1852.0, 1842.0, 1832.0, 1823.0],
    [1858.0, 1880.0, 1900.0, 1933.0, 1944.0, 1950.0, 1951.0, 1947.0, 1941.0, 1934.0, 1925.0, 1916.0, 1906.0, 1896.0, 1886.0, 1876.0, 1855.0, 1849.0, 1839.0, 1830.0],
    [1846.0, 1852.0, 1872.0, 1890.0, 1920.0, 1929.0, 1934.0, 1936.0, 1935.0, 1932.0, 1927.0, 1920.0, 1912.0, 1903.0, 1893.0, 1883.0, 1863.0, 1853.0, 1843.0, 1833.0],
    [1820.0, 1838.0, 1857.0, 1875.0, 1907.0, 1918.0, 1926.0, 1925.0, 1929.0, 1930.0, 1928.0, 1923.0, 1916.0, 1907.0, 1898.0, 1888.0, 1879.0, 1859.0, 1849.0, 1840.0],
    [1794.0, 1810.0, 1828.0, 1847.0, 1883.0, 1898.0, 1909.0, 1918.0, 1925.0, 1927.0, 1926.0, 1922.0, 1915.0, 1907.0, 1897.0, 1889.0, 1880.0, 1862.0, 1853.0, 1844.0],
    [1772.0, 1788.0, 1805.0, 1823.0, 1842.0, 1875.0, 1889.0, 1900.0, 1908.0, 1913.0, 1914.0, 1911.0, 1906.0, 1900.0, 1893.0, 1886.0, 1878.0, 1861.0, 1853.0, 1844.0],
    [1763.0, 1778.0, 1795.0, 1812.0, 1818.0, 1849.0, 1862.0, 1874.0, 1883.0, 1888.0, 1891.0, 1891.0, 1889.0, 1885.0, 1881.0, 1876.0, 1870.0, 1864.0, 1850.0, 1843.0],
    [1746.0, 1760.0, 1775.0, 1790.0, 1806.0, 1835.0, 1848.0, 1859.0, 1868.0, 1875.0, 1878.0, 1868.0, 1869.0, 1868.0, 1867.0, 1864.0, 1860.0, 1856.0, 1846.0, 1840.0],
    [1730.0, 1742.0, 1755.0, 1768.0, 1781.0, 1794.0, 1819.0, 1831.0, 1841.0, 1848.0, 1854.0, 1857.0, 1859.0, 1860.0, 1859.0, 1857.0, 1854.0, 1845.0, 1838.0, 1834.0],
    [1722.0, 1726.0, 1737.0, 1748.0, 1760.0, 1772.0, 1795.0, 1806.0, 1816.0, 1824.0, 1831.0, 1836.0, 1839.0, 1841.0, 1842.0, 1842.0, 1840.0, 1838.0, 1835.0, 1829.0],
    [1708.0, 1718.0, 1729.0, 1740.0, 1751.0, 1762.0, 1785.0, 1785.0, 1794.0, 1802.0, 1809.0, 1814.0, 1818.0, 1821.0, 1823.0, 1823.0, 1822.0, 1821.0, 1819.0, 1815.0]
]

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
var viewport = document.getElementById("viewport")
viewport.appendChild( renderer.domElement );


/* -------------------------------------------------------
    Terrain drawing
------------------------------------------------------- */ 
function placeNodeAtSpot(x, y, z, material) {
    if (!drawNodes) { return }
    var dotShape = new THREE.Mesh( nodeGeometry, material);
    dotShape.position.set(x, y, z);
    scene.add( dotShape );
}
function drawPlot(data, material) {
    var currentDisplayGeometry = new THREE.SphereGeometry(1,1,1);
    var currentDisplayMaterial = material;
    var currentDisplayTerrain = new THREE.Mesh( currentDisplayGeometry, currentDisplayMaterial);
    currentDisplayTerrain.position.set(0,0,0);
    

    for (var easting in data) {
        for (var northing in data[easting]) {


            /* -------
                Draw single elevation points
            ------- */

            placeNodeAtSpot(
                easting * nodeSpacingFactor, 
                (data[easting][northing] + heightOffset) * heightFactor,
                northing * nodeSpacingFactor,
                this.nodeMaterial
            ) 

    
            /* ------- 
            Draw north/south lines
            ------- */ 

            if (northing > 1 && easting % wireframeResolutionFactor == 0) {
                var lineGeometry = new THREE.Geometry();
    
                lineGeometry.vertices.push(
                    new THREE.Vector3(
                        easting * nodeSpacingFactor,
                        (data[easting][northing] + heightOffset) * heightFactor,
                        northing * nodeSpacingFactor
                    )
                )
    
                lineGeometry.vertices.push(
                    new THREE.Vector3(
                        easting * nodeSpacingFactor,
                        (data[easting][northing-1] + heightOffset) * heightFactor,
                        (northing - 1) * nodeSpacingFactor
                    )
                )
                var line = new THREE.Line(lineGeometry, material);
                currentDisplayTerrain.add(line);
            }
            if (easting > 1 && northing % wireframeResolutionFactor  == 0) {
                lineGeometry = new THREE.Geometry();

                lineGeometry.vertices.push(
                    new THREE.Vector3(
                        easting * nodeSpacingFactor,
                        (data[easting][northing] + heightOffset) * heightFactor,
                        northing * nodeSpacingFactor
                    )
                )
                lineGeometry.vertices.push(
                    new THREE.Vector3(
                        (easting - 1) * nodeSpacingFactor,
                        (data[easting-1][northing] + heightOffset) * heightFactor,
                        northing * nodeSpacingFactor
                    )
                )
                var line = new THREE.Line(lineGeometry, material);
                currentDisplayTerrain.add(line);

            }
        }
    }
    currentDisplayTerrain.name = "latest-terrain";
    scene.add(currentDisplayTerrain);
}

/* -------------------------------------------------------
    Camera position helpers
------------------------------------------------------- */ 

var cameraPosition = {
    mainView: function() {
        camera.position.x = 517.1996170854956;
        camera.position.y = 141.19051786019642;
        camera.position.z = 280.1864751286993;
        camera.rotation.x = -0.4667756867117924;
        camera.rotation.y = 1.0255139857293059;
        camera.rotation.z = 0.4068057224000214;
    },
    showcaseView: function() {
        camera.position.x = 826.3669282284727;
        camera.position.y = -221.4827348648144;
        camera.position.z = -31.116286932030782;
        camera.rotation.x = 1.9574056341510448;
        camera.rotation.y = 1.1521917983810586;
        camera.rotation.z = -1.9899589029
    },
    animationView: function() {
        camera.position.x = 220.7605568238203;
        camera.position.y = 10.507774462181791;
        camera.position.z = -921.8726416009445;
        camera.rotation.x = -3.130194853884681;
        camera.rotation.y = 0.23502878690842438;
        camera.rotation.z = 3.138938328205593;
    }
}



/* -------------------------------------------------------
    Camera Animation
------------------------------------------------------- */ 
var cameraPadding = 5;

var mapEastWidth = yamData.length;
var mapNorthWidth = yamData[0].length;
var eastMidpoint = (mapEastWidth/2) * nodeSpacingFactor;
var northMidpoint = (mapNorthWidth/2) * nodeSpacingFactor;
var cameraSpeed = nodeSpacingFactor * cameraSpeedFactor;
var cameraOriginWidth = eastMidpoint + cameraPadding;

if (northMidpoint > eastMidpoint) {
    cameraOriginWidth = northMidpoint + cameraPadding;
}

cameraOriginWidth = 10;

var cameraOriginGeometry = new THREE.SphereGeometry(
    cameraOriginWidth,
    32,
    32
);
var cameraOriginMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var cameraOrigin = new THREE.Mesh( cameraOriginGeometry, cameraOriginMaterial);
cameraOrigin.position.set(
    eastMidpoint,
    0,
    northMidpoint 
);
cameraOrigin.add(camera);
cameraOrigin.visible = false;
camera.lookAt(cameraOrigin);
scene.add(cameraOrigin);


function animateCamera() {
//    camera.position.x= camera.position.x + cameraSpeed; // Pan/track
    cameraOrigin.rotateOnAxis(
        new THREE.Vector3(0, 1, 0),
        Math.PI/64
    )
}


/* -------------------------------------------------------
    Terrain animation
------------------------------------------------------- */ 

// Initialize viewframe

var viewframeSize = {
    "east": 400, //easting
    "north":200, //northing
}

var draw = true;

function createViewframe(frameSize) {
    var frame = {
        "size": frameSize,
        "pointGrid": [],
        "rootNode": new THREE.Mesh( new THREE.SphereGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0xff0000})),
        "geometry": [],
        "position": {
            "east":frameSize.east,
            "north":frameSize.north
        }

    }

//    frame.rootNode.visible = false;

    for (var east = 0; east < frameSize.east; east++) {
        var eastScanLinePoints = []
        for (var north = 0; north < frameSize.north; north++) {
           eastScanLinePoints.push(
               new THREE.Vector3(
                    east * nodeSpacingFactor,
                    500, //initialize all points at an arbitrary height
                    north * nodeSpacingFactor
               )
           );
        }
        frame.pointGrid.push(eastScanLinePoints);

        if (east % animatedLineSpacing == 0) {
            var eastScanLineGeometry = new THREE.Geometry();
            eastScanLineGeometry.vertices = eastScanLinePoints;
            var eastScanLine = new THREE.Line(eastScanLineGeometry, new THREE.MeshBasicMaterial({color: 0x00ff00}));
            frame.geometry.push(eastScanLine)
            frame.rootNode.add(eastScanLine)
         }
    }
    return frame;
}

function stepViewFrameData(frame) {
    frame.pointGrid.push(frame.pointGrid.shift());

    frame.position.east++;


    frame.pointGrid.forEach(function updateScanLine(eastScanLine, eastIndex) {
        eastScanLine.forEach(function updatePoint(point, northIndex) {
            frame.pointGrid[eastIndex][northIndex].x = eastIndex * nodeSpacingFactor;
            frame.pointGrid[eastIndex][northIndex].z = northIndex * nodeSpacingFactor;
        })
    });

    frame.geometry.forEach(function recalculateLine(line, index) {
        line.geometry.dynamic = true;
        line.geometry.verticesNeedUpdate = true;
    })
}

function initializeGroundAnimation(mapData, frame) {
    frame.pointGrid.forEach(function setScanLine(eastScanLine, east) {
        eastScanLine.forEach(function setPointValue(height, north) {
            frame.pointGrid[east][north].y = (mapData[east][north] + heightOffset) * heightFactor
        })
    })
    stepViewFrameData(frame)
}

function animateTopology(frame) {
    stepViewFrameData(frame)
}


/* -------------------------------------------------------
    Mouse & Touch camera controls
------------------------------------------------------- */ 

controls = new THREE.OrbitControls( camera );
controls.damping = 0.2;
controls.addEventListener( 'change', render );


/* -------------------------------------------------------
    Main drawing logic
------------------------------------------------------- */ 

cameraPosition.animationView();

var render = function () {
	requestAnimationFrame( render );
	renderer.render(scene, camera);
//    animateCamera();
    animateTopology(scanningView);
};

var scanningView = createViewframe(viewframeSize)
scene.add(scanningView.rootNode)
initializeGroundAnimation(yamData, scanningView)

render();

/* -------------------------------------------------------
    debug junk
------------------------------------------------------- */ 
var logger = document.getElementById("log");
var debugLog = function(text) {
    logger.value += text + "\n";
}
var camDump = function () {
    logger.value = "";
    debugLog("camera.position.x = " + camera.position.x + ";")
    debugLog("camera.position.y = " + camera.position.y + ";")
    debugLog("camera.position.z = " + camera.position.z + ";")
    debugLog("camera.rotation.x = " + camera.rotation.x + ";")
    debugLog("camera.rotation.y = " + camera.rotation.y + ";")
    debugLog("camera.rotation.z = " + camera.rotation.z + ";")
    console.log(logger.value);
}
//yamData = sampleData;

//drawPlot(yamData, lineMaterial);
