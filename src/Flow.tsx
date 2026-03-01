export interface Option {
    label: string;
    next: string | null;
    type?: 'danger' | 'warning' | 'success';
}

export interface FlowState {
    question?: string;
    options?: Option[];
    isResult?: boolean;
    type?: 'danger' | 'warning' | 'success';
}

export const flowData: Record<string, FlowState> = {
    START_MENU: {
        question: "¿Qué tipo de servicio vamos a asistir?",
        options: [
            { label: "📍 Conexión por Antena (AIRE)", next: "AIRE_BUSCAR" },
            { label: "🌐 Conexión General / Fibra", next: "GEN_BUSCAR" }
        ]
    },

    // --- FLUJO AIRE --- //
    AIRE_BUSCAR: {
        question: "1. Buscar cliente en ISPCUBE. ¿Está bloqueado/cortado el servicio?",
        options: [
            { label: "⏳ Cortado: Falta de pago", next: "FIN_PAGO", type: "danger" },
            { label: "🔒 Cortado: Sin deuda", next: "FIN_SUPER", type: "warning" },
            { label: "✅ NO Cortado", next: "AIRE_IDENTIFICAR", type: "success" }
        ]
    },
    AIRE_IDENTIFICAR: {
        question: "Identificar si es Fibra o Aire. Como elegimos Aire, continuamos con:",
        options: [
            { label: "Continuar flujo de Aire (Verificar Señal)", next: "AIRE_AIRCONTROL" }
        ]
    },
    AIRE_AIRCONTROL: {
        question: "2. Verificar señal en AIRCONTROL",
        options: [
            { label: "📡 Antena APAGADA", next: "FIN_AIRE_APAGADA", type: "danger" },
            { label: "📶 Antena PRENDIDA (-40 a -65)", next: "AIRE_LAN_SPEED", type: "success" },
            { label: "📉 Antena PRENDIDA (-66 a -80)", next: "FIN_VISITA_TEC", type: "warning" }
        ]
    },
    AIRE_LAN_SPEED: {
        question: "Verificar LAN Speed en AIRCONTROL",
        options: [
            { label: "⚡ Figura de 100 a 1000", next: "AIRE_CONSUMO", type: "success" },
            { label: "⚠️ Otros valores o falla en LAN", next: "FIN_VISITA_TEC", type: "warning" }
        ]
    },
    AIRE_CONSUMO: {
        question: "3. Ver consumo del cliente",
        options: [
            { label: "📉 Consumo REDUCIDO", next: "FIN_MENSAJE_REDUCIDO", type: "warning" },
            { label: "📊 Consumo NORMAL", next: "AIRE_ROUTER", type: "success" }
        ]
    },
    AIRE_ROUTER: {
        question: "4. Intentar ENTRAR AL ROUTER",
        options: [
            { label: "🔓 Puedo ingresar al Router", next: "AIRE_DENTRO_ROUTER", type: "success" },
            { label: "🚫 NO puedo ingresar al Router", next: "AIRE_RANGO", type: "danger" }
        ]
    },
    AIRE_DENTRO_ROUTER: {
        question: "Dentro del Router: ¿Cuántos dispositivos hay y cómo es el uso?",
        options: [
            { label: "📱 Más de 8 equipos conectados + Hace mal uso", next: "FIN_ADMIN_DISPOSITIVOS", type: "warning" },
            { label: "✅ No más de Router / Uso Normal", next: "FIN_TODO_NORMAL", type: "success" }
        ]
    },
    AIRE_RANGO: {
        question: "5. VERIFICAR RANGO (Si no está en rango 200, cambiar rango)",
        options: [
            { label: "🔄 Cambié el rango y AHORA PUEDO ingresar", next: "AIRE_DENTRO_ROUTER", type: "success" },
            { label: "❌ Cambié el rango (o ya estaba) y sigo SIN PODER ingresar", next: "FIN_TODO_NORMAL_INSISTE", type: "danger" }
        ]
    },

    // --- RESULTADOS FINALES DE AIRE --- //
    FIN_PAGO: { question: "Falta de pago → Enviar método de pago.", isResult: true, type: "danger" },
    FIN_SUPER: { question: "Sin deuda → Consultar al supervisor.", isResult: true, type: "warning" },
    FIN_AIRE_APAGADA: { question: "Enviar mensaje de antena apagada.", isResult: true, type: "danger" },
    FIN_MENSAJE_REDUCIDO: { question: "Enviar mensaje de servicio reducido.", isResult: true, type: "warning" },
    FIN_ADMIN_DISPOSITIVOS: { question: "Enviar para administrar dispositivos.", isResult: true, type: "warning" },
    FIN_TODO_NORMAL: { question: "Enviar mensaje 'Todo normal'. Si el cliente insiste → VISITA TÉCNICA.", isResult: true, type: "success" },
    FIN_TODO_NORMAL_INSISTE: { question: "Enviar mensaje 'Todo normal'. Como no pudiste ingresar, si insiste → VISITA TÉCNICA.", isResult: true, type: "warning" },
    FIN_VISITA_TEC: { question: "Agendar VISITA TÉCNICA.", isResult: true, type: "warning" },

    // --- FLUJO GENERAL (FIBRA / OTROS) --- //
    GEN_BUSCAR: {
        question: "Buscar en ISPCube. ¿El cliente está bloqueado?",
        options: [
            { label: "🔒 BLOQUEADO", next: "FIN_PAGO_GEN", type: "danger" },
            { label: "✅ NO BLOQUEADO", next: "GEN_PING", type: "success" }
        ]
    },
    GEN_PING: {
        question: "Hacer PING al equipo del cliente",
        options: [
            { label: "❌ NO HACE PING", next: "GEN_NO_PING", type: "danger" },
            { label: "✅ SÍ HACE PING", next: "GEN_CONSUMO", type: "success" }
        ]
    },
    GEN_NO_PING: {
        question: "Ver otros clientes en el mismo nodo/caja. ¿Tienen PING?",
        options: [
            { label: "👀 Falla en Caja general (o monitoreo 24hs tampoco da PING)", next: "FIN_MONITOREO_CAJA", type: "warning" },
            { label: "❌ Cliente aislado (Solo este no da PING)", next: "FIN_VISITA_GEN", type: "warning" }
        ]
    },
    GEN_CONSUMO: {
        question: "Ver Consumo",
        options: [
            { label: "Limitado", next: "FIN_MENSAJE_REDUCIDO_GEN", type: "warning" },
            { label: "No limitado", next: "FIN_TODO_NORMAL_GEN", type: "success" }
        ]
    },

    // --- RESULTADOS FINALES GENERAL --- //
    FIN_PAGO_GEN: { question: "Bloqueado → Enviar Pago $.", isResult: true, type: "danger" },
    FIN_MONITOREO_CAJA: { question: "Falla en Caja / Monitoreo 24hs. Escalar a Redes/Nodos.", isResult: true, type: "warning" },
    FIN_VISITA_GEN: { question: "Falla individual sin PING → Agendar Visita Técnica.", isResult: true, type: "warning" },
    FIN_MENSAJE_REDUCIDO_GEN: { question: "Servicio Limitado. Enviar mensaje informando.", isResult: true, type: "warning" },
    FIN_TODO_NORMAL_GEN: { question: "Todo normal. Si insiste → VISITA TÉCNICA.", isResult: true, type: "success" }
};
