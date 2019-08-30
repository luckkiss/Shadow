export const templates = [
  {
    name: "transition_sprite",
    vert: `
    uniform mat4 viewProj;
    attribute vec3 a_position;
    attribute lowp vec4 a_color;
    varying mediump vec4 v_pos;
    #ifdef useModel 
        uniform mat4 model;
    #endif
    #ifdef useTexture
        attribute mediump vec2 a_uv0;  
        varying mediump vec2 uv0;
    #endif
    #ifndef useColor 
        varying lowp vec4 v_fragmentColor;
    #endif
    void main () {
        mat4 mvp;
        #ifdef useModel
             mvp = viewProj * model;
        #else
             mvp = viewProj;  
        #endif  
        vec4 pos = mvp * vec4(a_position, 1);
        #ifndef useColor
             v_fragmentColor = a_color;
        #endif
        #ifdef useTexture    
             uv0 = a_uv0;  
        #endif  
        v_pos = pos;
        gl_Position = pos;
    }`,
    frag: `
    uniform float time;
    uniform float range;
    varying mediump vec4 v_pos;
    #ifdef useTexture  
        uniform sampler2D texture;  
        varying mediump vec2 uv0;
    #endif
    #ifdef useColor
        uniform lowp vec4 color;
    #else  
        varying lowp vec4 v_fragmentColor;
    #endif
    void main () {  
        #ifdef useColor    
             vec4 o = color;
        #else
             vec4 o = v_fragmentColor;  
        #endif  
        #ifdef useTexture    
             o *= texture2D(texture, uv0); 
             if (uv0.x <= time) {
                float factor = time - uv0.x;
                if (factor > range) o.w *= 0.0;
                else o.w *= (1.0-factor/range);
                
            } else {
                o.w *=  1.0;
            }
        #else
            float px = v_pos.x + 1.0;
            if (px <= time*2.0) {
                float factor = time*2.0 - px;
                if (factor > range) o.w *= 0.0;
                else o.w *= (1.0-factor/range);
            } else {
                o.w *=  1.0;
            }
        #endif  
        
        gl_FragColor = o;
    }`,
    defines: [
      { name: "useModel" },
      { name: "useTexture" },
      { name: "useColor" }
    ]
  },

  {
    name: "butterfly_spring",
    vert: `
  
    uniform mat4 viewProj;
    attribute vec3 a_position;
    attribute lowp vec4 a_color;
    #ifdef useModel 
        uniform mat4 model;
    #endif
    #ifdef useTexture
        attribute mediump vec2 a_uv0;  
        varying mediump vec2 uv0;
    #endif
    #ifndef useColor 
        varying lowp vec4 v_fragmentColor;
    #endif
    void main () {
        mat4 mvp;
        #ifdef useModel
             mvp = viewProj * model;
        #else
             mvp = viewProj;  
        #endif  
        vec4 pos = mvp * vec4(a_position, 1);
        #ifndef useColor
             v_fragmentColor = a_color;
        #endif
        #ifdef useTexture    
             uv0 = a_uv0;  
        #endif  
    
        gl_Position = pos;
    }`,
    frag: `
    #ifdef useTexture  
        uniform sampler2D texture;  
        varying mediump vec2 uv0;
    #endif
    #ifdef useColor
        uniform lowp vec4 color;
    #else  
        varying lowp vec4 v_fragmentColor;
    #endif
    void main () {  
        #ifdef useColor    
             vec4 o = color;
        #else
             vec4 o = v_fragmentColor;  
        #endif  
        #ifdef useTexture    
             vec2 uv_temp = uv0;
             float x = uv_temp.x;
             float y = uv_temp.y;
             float offset = uv0.x * 3.14 / 2.0;
             o.r = offset;
             o *= texture2D(texture, uv_temp); 

        #endif  
        gl_FragColor = o;
    }`,
    defines: [
      { name: "useModel" },
      { name: "useTexture" },
      { name: "useColor" }
    ]
  },

  {
    name: "wave_sprite",
    vert: `
    uniform float time;
    uniform float deltaTime;
    varying float v_time;
    varying float v_deltaTime;
    uniform mat4 viewProj;
    attribute vec3 a_position;
    attribute lowp vec4 a_color;
    #ifdef useModel 
        uniform mat4 model;
    #endif
    #ifdef useTexture
        attribute mediump vec2 a_uv0;  
        varying mediump vec2 uv0;
    #endif
    #ifndef useColor 
        varying lowp vec4 v_fragmentColor;
    #endif
    void main () {
        mat4 mvp;
        #ifdef useModel
             mvp = viewProj * model;
        #else
             mvp = viewProj;  
        #endif  
        vec4 pos = mvp * vec4(a_position, 1);
        #ifndef useColor
             v_fragmentColor = a_color;
        #endif
        #ifdef useTexture    
             uv0 = a_uv0;  
        #endif  
        v_time = time;
        v_deltaTime = deltaTime;
        gl_Position = pos;
    }`,
    frag: `
    varying float v_time;
    varying float v_deltaTime;
    
    uniform float range;
    #ifdef useTexture  
        uniform sampler2D texture;  
        varying mediump vec2 uv0;
    #endif
    #ifdef useColor
        uniform lowp vec4 color;
    #else  
        varying lowp vec4 v_fragmentColor;
    #endif
    void main () {  
        #ifdef useColor    
             vec4 o = color;
        #else
             vec4 o = v_fragmentColor;  
        #endif  
        #ifdef useTexture    
             vec2 uv_temp = uv0;
             float x = uv_temp.x;
             float y = uv_temp.y;
             uv_temp.x += range*(sin(v_deltaTime + v_time + y) - sin(v_time + y));
             uv_temp.y += range*(sin(v_deltaTime + v_time + x) - sin(v_time + x));
             
             o *= texture2D(texture, uv_temp); 
            
        #endif  
        //if (abs(o.x - 1.0) < 0.05 && abs(o.y - 1.0) < 0.05 && abs(o.z - 1.0) < 0.05) o.w = 0.0;
        gl_FragColor = o;
    }`,
    defines: [
      { name: "useModel" },
      { name: "useTexture" },
      { name: "useColor" }
    ]
  },

  {
    name: "point_wave",
    vert: `
    uniform float time;
    uniform float deltaTime;
    varying float v_time;
    varying float v_deltaTime;
    uniform mat4 viewProj;
    attribute vec3 a_position;
    attribute lowp vec4 a_color;
    #ifdef useModel 
        uniform mat4 model;
    #endif
    #ifdef useTexture
        attribute mediump vec2 a_uv0;  
        varying mediump vec2 uv0;
    #endif
    #ifndef useColor 
        varying lowp vec4 v_fragmentColor;
    #endif
    void main () {
        mat4 mvp;
        #ifdef useModel
             mvp = viewProj * model;
        #else
             mvp = viewProj;  
        #endif  
        vec4 pos = mvp * vec4(a_position, 1);
        #ifndef useColor
             v_fragmentColor = a_color;
        #endif
        #ifdef useTexture    
             uv0 = a_uv0;  
        #endif  
        v_time = time;
        v_deltaTime = deltaTime;
        gl_Position = pos;
    }`,
    frag: `
    varying float v_time;
    varying float v_deltaTime;
    uniform mediump vec2 point;  
    uniform float range;
    #ifdef useTexture  
        uniform sampler2D texture;  
        varying mediump vec2 uv0;
    #endif
    #ifdef useColor
        uniform lowp vec4 color;
    #else  
        varying lowp vec4 v_fragmentColor;
    #endif
    void main () {  
        #ifdef useColor    
             vec4 o = color;
        #else
             vec4 o = v_fragmentColor;  
        #endif  
        #ifdef useTexture    
             vec2 uv_temp = uv0;
             float x = uv_temp.x;
             float y = uv_temp.y;
             float r = sqrt((x-point.x)*(x-point.x) + (y-point.y)*(y-point.y));
             float f = abs(range - abs(r - v_time));
             if (abs(r - v_time) < range) {
                 if(x > point.x) {
                    uv_temp.x -= 0.01;
                 } else if (x < point.x) {
                     uv_temp.x += 0.01;
                 }
               
                 if(y > point.y) {
                    uv_temp.y -= 0.01;
                 } else if (y > point.y) {
                     uv_temp.y += 0.01;
                 }
                 
                o.r *= (1.0 + f);
                o.b *= (1.0 + f);
                o.g *= (1.0 + f);
             
             } else {
                #ifdef useShadow
                 if (f > 0.3) f = 0.3;
                o.r *= (1.0 - f);
                o.b *= (1.0 - f);
                o.g *= (1.0 - f);
                #endif 

             }
             o *= texture2D(texture, uv_temp); 
            
        #endif  
        //if (abs(o.x - 1.0) < 0.05 && abs(o.y - 1.0) < 0.05 && abs(o.z - 1.0) < 0.05) o.w = 0.0;
        gl_FragColor = o;
    }`,
    defines: [
      { name: "useModel" },
      { name: "useTexture" },
      { name: "useColor" }
    ]
  },

  {
    name: "pixel_style",
    vert: `
    uniform mat4 viewProj;
    attribute vec3 a_position;
    attribute lowp vec4 a_color;
    #ifdef useModel 
        uniform mat4 model;
    #endif
    #ifdef useTexture
        attribute mediump vec2 a_uv0;  
        varying mediump vec2 uv0;
    #endif
    #ifndef useColor 
        varying lowp vec4 v_fragmentColor;
    #endif
    void main () {
        mat4 mvp;
        #ifdef useModel
             mvp = viewProj * model;
        #else
             mvp = viewProj;  
        #endif  
        vec4 pos = mvp * vec4(a_position, 1);
        #ifndef useColor
             v_fragmentColor = a_color;
        #endif
        #ifdef useTexture    
             uv0 = a_uv0;  
        #endif  
        gl_Position = pos;
    }`,
    frag: `
    uniform float sampleCount;
    #ifdef useTexture  
        uniform sampler2D texture;  
        varying mediump vec2 uv0;
    #endif
    #ifdef useColor
        uniform lowp vec4 color;
    #else  
        varying lowp vec4 v_fragmentColor;
    #endif
    void main () {  
        #ifdef useColor    
             vec4 o = color;
        #else
             vec4 o = v_fragmentColor;  
        #endif  
        #ifdef useTexture    
             vec2 uv_temp = uv0;
             float count = 1.0 / sampleCount;

             float i = floor(uv0.x / count);
             float j = floor(uv0.y / count);
             float startX = count * i;
             float endX = startX + count;
             float pointX = (startX + endX) / 2.0;
             

             float startY = count * j;
             float endY= startY + count;
             float pointY = (startY + endY) / 2.0;
             
             if (uv0.x > startX && uv0.x < endX && uv0.y > startY && uv0.y < endY) {
                uv_temp.x = pointX;
                uv_temp.y = pointY;
            }
             o *= texture2D(texture, uv_temp); 
             #ifdef disableColor  
                 float av = (o.r+o.g+o.b) / 3.0;  
                 o.r = av;
                 o.g = av;
                 o.b = av;
            #endif  
        #endif  
        gl_FragColor = o;
    }`,
    defines: [
      { name: "useModel" },
      { name: "useTexture" },
      { name: "useColor" }
    ]
  },

  {
    name: "spine_pxiel",
    vert: `
    uniform mat4 viewProj;
    #ifdef use2DPos
      attribute vec2 a_position;
    #else
      attribute vec3 a_position;
    #endif
    attribute lowp vec4 a_color;
    #ifdef useTint
      attribute lowp vec4 a_color0;
    #endif
    #ifdef useModel  
      uniform mat4 model;
    #endif
    attribute mediump vec2 a_uv0;
    varying mediump vec2 uv0;
    varying lowp vec4 v_light;
    #ifdef useTint  
      varying lowp vec4 v_dark;
    #endif
    void main () {
        mat4 mvp;
        #ifdef useModel    
           mvp = viewProj * model;  
        #else    
           mvp = viewProj;  
        #endif
        #ifdef use2DPos  
           vec4 pos = mvp * vec4(a_position, 0, 1);
        #else  
           vec4 pos = mvp * vec4(a_position, 1);  
        #endif  
        v_light = a_color;  
        #ifdef useTint    
           v_dark = a_color0;  
        #endif  
        uv0 = a_uv0;  
        gl_Position = pos;
    }`,
    frag: `
        uniform float sampleCount;
        uniform sampler2D texture;
        varying mediump vec2 uv0;
        #ifdef alphaTest  
           uniform lowp float alphaThreshold;
        #endif
        varying lowp vec4 v_light;
        #ifdef useTint
           varying lowp vec4 v_dark;
        #endif
        void main () {
                vec2 uv_temp = uv0;
                float count = 1.0 / sampleCount;

                float i = floor(uv0.x / count);
                float j = floor(uv0.y / count);
                float startX = count * i;
                float endX = startX + count;
                float pointX = (startX + endX) / 2.0;
             

                float startY = count * j;
                float endY= startY + count;
                float pointY = (startY + endY) / 2.0;
             
                if (uv0.x > startX && uv0.x < endX && uv0.y > startY && uv0.y < endY) {
                   uv_temp.x = pointX;
                   uv_temp.y = pointY;
                }

                vec4 texColor = texture2D(texture, uv_temp);
                vec4 finalColor;  
                #ifdef useTint
                    finalColor.a = v_light.a * texColor.a;    
                    finalColor.rgb = ((texColor.a - 1.0) * v_dark.a + 1.0 - texColor.rgb) * v_dark.rgb + texColor.rgb * v_light.rgb;  
                #else
                    finalColor = texColor * v_light;
                #endif  
                #ifdef alphaTest    
                    if (finalColor.a <= alphaThreshold)      
                        discard;  
                #endif  
                #ifdef disableColor    
                    float av = (finalColor.r+finalColor.g+finalColor.b) / 3.0;  
                    finalColor.r = av;
                    finalColor.g = av;
                    finalColor.b = av;
                #endif  
                gl_FragColor = finalColor;
        }`,
    defines: [
      { name: "useModel" },
      { name: "alphaTest" },
      { name: "use2DPos" },
      { name: "useTint" }
    ]
  }
];
