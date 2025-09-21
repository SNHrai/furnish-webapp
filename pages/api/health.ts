import type { NextApiRequest, NextApiResponse } from 'next';
import { checkSystemHealth, checkCriticalHealth, getServiceConfig } from '@/lib/services/health-check';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const checkType = query.type as string;

    switch (checkType) {
      case 'critical':
        // Quick health check for critical services only
        const criticalHealth = await checkCriticalHealth();
        res.status(criticalHealth.isHealthy ? 200 : 503).json({
          status: criticalHealth.isHealthy ? 'healthy' : 'unhealthy',
          timestamp: new Date().toISOString(),
          critical_services: {
            is_healthy: criticalHealth.isHealthy,
            issues: criticalHealth.issues,
          },
        });
        break;

      case 'config':
        // Return service configuration information
        const config = getServiceConfig();
        res.status(200).json({
          status: 'ok',
          timestamp: new Date().toISOString(),
          configuration: config,
        });
        break;

      case 'detailed':
      default:
        // Full system health check
        const systemHealth = await checkSystemHealth();
        const statusCode = systemHealth.overall_status === 'unhealthy' ? 503 : 
                          systemHealth.overall_status === 'degraded' ? 206 : 200;
        
        res.status(statusCode).json({
          status: systemHealth.overall_status,
          timestamp: systemHealth.timestamp,
          services: systemHealth.services,
          environment: systemHealth.environment,
          summary: {
            total_services: systemHealth.services.length,
            healthy_services: systemHealth.services.filter(s => s.status === 'healthy').length,
            unhealthy_services: systemHealth.services.filter(s => s.status === 'unhealthy').length,
            disabled_services: systemHealth.services.filter(s => s.status === 'disabled').length,
            average_response_time: systemHealth.services
              .filter(s => s.response_time)
              .reduce((sum, s) => sum + (s.response_time || 0), 0) / 
              systemHealth.services.filter(s => s.response_time).length || 0,
          },
        });
        break;
    }
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Health check failed',
    });
  }
}