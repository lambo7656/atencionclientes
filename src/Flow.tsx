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
            { label: "🌐 Conexión General / Fibra", next: "FIBRA_BUSCAR" }
        ]
    },

    // --- FLUJO AIRE --- //
    AIRE_BUSCAR: {
        question: "1. Buscar cliente en ISPCUBE. ¿El servicio está bloqueado/cortado?",
        options: [
            { label: "🔴 CORTADO: Falta de pago", next: "FIN_AIRE_PAGO", type: "danger" },
            { label: "🔴 CORTADO: Sin deuda", next: "FIN_AIRE_SUPERVISOR", type: "warning" },
            { label: "🟢 NO está cortado", next: "AIRE_AIRCONTROL", type: "success" }
        ]
    },
    AIRE_AIRCONTROL: {
        question: "2. Verificar señal en AIRCONTROL",
        options: [
            { label: "📡 Antena APAGADA", next: "FIN_AIRE_ANTENA_APAGADA", type: "danger" },
            { label: "📶 Antena PRENDIDA (Señal -40 a -65)", next: "AIRE_LAN_SPEED", type: "success" },
            { label: "📉 Antena PRENDIDA (Señal -66 a -80)", next: "FIN_AIRE_VISITA_TECNICA", type: "warning" }
        ]
    },
    AIRE_LAN_SPEED: {
        question: "Verificar LAN Speed en AIRCONTROL",
        options: [
            { label: "❌ No figura o dice 10", next: "FIN_AIRE_ROUTER_APAGADO", type: "danger" },
            { label: "⚡ Figura 100 a 1000", next: "AIRE_CONSUMO", type: "success" }
        ]
    },
    AIRE_CONSUMO: {
        question: "3. Ver consumo del cliente",
        options: [
            { label: "📉 Consumo REDUCIDO", next: "FIN_AIRE_CONSUMO_REDUCIDO", type: "warning" },
            { label: "📊 Consumo NORMAL", next: "AIRE_ROUTER", type: "success" }
        ]
    },
    AIRE_ROUTER: {
        question: "4. Intentar ENTRAR AL ROUTER",
        options: [
            { label: "🔓 Puedo ingresar", next: "AIRE_ROUTER_DENTRO", type: "success" },
            { label: "🚫 NO puedo ingresar", next: "AIRE_ANTENA_RANGO", type: "danger" }
        ]
    },
    AIRE_ROUTER_DENTRO: {
        question: "Verificar equipos conectados y hacer PING",
        options: [
            { label: "📱 Más de 8 equipos conectados + hace PING", next: "FIN_AIRE_CAMBIAR_CLAVE", type: "warning" },
            { label: "✅ Menos de 8 equipos + hace PING", next: "FIN_AIRE_TODO_NORMAL", type: "success" },
            { label: "❌ No hace PING", next: "FIN_AIRE_SUPERVISOR_PING", type: "danger" }
        ]
    },
    AIRE_ANTENA_RANGO: {
        question: "5. Ingresar a la antena → Verificar que el router esté conectado. ¿Está en rango 200?",
        options: [
            { label: "❌ No está en rango 200", next: "AIRE_CAMBIAR_RANGO", type: "warning" },
            { label: "✅ Sí está en rango 200", next: "FIN_AIRE_TODO_NORMAL_INSISTE", type: "danger" }
        ]
    },
    AIRE_CAMBIAR_RANGO: {
        question: "Cambiar rango e intentar ingresar nuevamente al router",
        options: [
            { label: "🔓 Ahora puedo ingresar", next: "AIRE_ROUTER_DENTRO", type: "success" },
            { label: "🚫 No puedo ingresar", next: "FIN_AIRE_TODO_NORMAL_INSISTE", type: "danger" }
        ]
    },

    // --- RESULTADOS FINALES DE AIRE --- //
    FIN_AIRE_PAGO: { question: "Falta de pago → Enviar método de pago.", isResult: true, type: "danger" },
    FIN_AIRE_SUPERVISOR: { question: "Sin deuda → Consultar supervisor.", isResult: true, type: "warning" },
    FIN_AIRE_ANTENA_APAGADA: { question: "Enviar mensaje de antena apagada.", isResult: true, type: "danger" },
    FIN_AIRE_VISITA_TECNICA: { question: "VISITA TÉCNICA.", isResult: true, type: "warning" },
    FIN_AIRE_ROUTER_APAGADA: { question: "Enviar mensaje: Router apagado.", isResult: true, type: "danger" },
    FIN_AIRE_CONSUMO_REDUCIDO: { question: "Enviar mensaje de servicio reducido.", isResult: true, type: "warning" },
    FIN_AIRE_CAMBIAR_CLAVE: { question: "Cambiar clave → Administrar cantidad de dispositivos.", isResult: true, type: "warning" },
    FIN_AIRE_TODO_NORMAL: { question: "Enviar mensaje: 'Todo normal aire/antena'.", isResult: true, type: "success" },
    FIN_AIRE_SUPERVISOR_PING: { question: "Consultar con supervisor.", isResult: true, type: "danger" },
    FIN_AIRE_TODO_NORMAL_INSISTE: { question: "Enviar mensaje: 'Todo normal'. Si el cliente insiste → Visita técnica.", isResult: true, type: "warning" },

    // --- FLUJO FIBRA --- //
    FIBRA_BUSCAR: {
        question: "1. Verificar en ISPCube. ¿El servicio está bloqueado?",
        options: [
            { label: "🔴 BLOQUEADO: Falta de pago", next: "FIN_FIBRA_PAGO", type: "danger" },
            { label: "🟢 NO BLOQUEADO (Identificar si es Fibra)", next: "FIBRA_ACCION", type: "success" }
        ]
    },
    FIBRA_ACCION: {
        question: "3. Cliente identificado como Fibra. ¿Por dónde empezar a verificar?",
        options: [
            { label: "💻 4. Prueba de PING (CMD)", next: "FIBRA_PING", type: "success" },
            { label: "☁️ 6. Verificación en OLTCLOUD", next: "FIBRA_OLTCLOUD", type: "warning" }
        ]
    },
    FIBRA_PING: {
        question: "4. Prueba de PING (CMD) a la IP_DEL_CLIENTE",
        options: [
            { label: "❌ 4A NO responde PING", next: "FIBRA_OTROS_CLIENTES_PING", type: "danger" },
            { label: "✅ 5 SÍ responde PING", next: "FIBRA_CONSUMO", type: "success" }
        ]
    },
    FIBRA_OTROS_CLIENTES_PING: {
        question: "Consultar otros clientes de la misma caja / CTO. ¿Tienen PING?",
        options: [
            { label: "❌ Otros clientes NO hacen PING (4B)", next: "FIN_FIBRA_FALLA_CAJA", type: "danger" },
            { label: "✅ Otros clientes SÍ hacen PING (4C)", next: "FIN_FIBRA_ROUTER_APAGADO", type: "warning" }
        ]
    },
    FIBRA_CONSUMO: {
        question: "5. Verificar consumo",
        options: [
            { label: "⚠️ Consumo limitado (5A)", next: "FIN_FIBRA_TRANSFERENCIA_SOBREPASADA", type: "warning" },
            { label: "✅ Consumo NO limitado (5B)", next: "FIN_FIBRA_SERVICIO_NORMAL", type: "success" }
        ]
    },
    FIBRA_OLTCLOUD: {
        question: "6. Verificación en OLTCLOUD. Buscar por número de serie.",
        options: [
            { label: "🟢 Cliente ENCENDIDO en OLT (6A)", next: "FIBRA_PING", type: "success" },
            { label: "🔴 Cliente APAGADO en OLT (6B)", next: "FIBRA_OTROS_CLIENTES_OLT", type: "danger" }
        ]
    },
    FIBRA_OTROS_CLIENTES_OLT: {
        question: "Verificar otros clientes de la misma caja.",
        options: [
            { label: "🔴 También están apagados", next: "FIN_FIBRA_FALLA_CAJA", type: "danger" },
            { label: "🟢 Los demás están encendidos", next: "FIN_FIBRA_VISITA_TECNICA", type: "warning" }
        ]
    },

    // --- RESULTADOS FINALES DE FIBRA --- //
    FIN_FIBRA_PAGO: { question: "Falta de pago. Corroborar deuda. Enviar método de pago. Informar motivo del bloqueo. Fin de gestión.", isResult: true, type: "danger" },
    FIN_FIBRA_FALLA_CAJA: { question: "Falla en caja. Enviar mensaje 'Falla en caja'. Monitorear 24 hs. Si continúa → Agendar visita técnica.", isResult: true, type: "danger" },
    FIN_FIBRA_ROUTER_APAGADO: { question: "Enviar mensaje 'Router apagado o desconectado'.", isResult: true, type: "warning" },
    FIN_FIBRA_TRANSFERENCIA_SOBREPASADA: { question: "Enviar mensaje 'Transferencia sobrepasada'.", isResult: true, type: "warning" },
    FIN_FIBRA_SERVICIO_NORMAL: { question: "Enviar mensaje 'Servicio normal'. Si el cliente insiste → Agendar visita técnica.", isResult: true, type: "success" },
    FIN_FIBRA_VISITA_TECNICA: { question: "Agendar visita técnica para revisar caja/conexión.", isResult: true, type: "warning" }
};
