import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { pickAndImport, exportAndShare } from '@/lib/db/import-export';

type Props = {
  visible: boolean;
  onClose: () => void;
  onImportComplete: () => void;
};

export default function ImportExportModal({ visible, onClose, onImportComplete }: Props) {
  const theme = useTheme();
  const [loading, setLoading] = useState<'idle' | 'importing' | 'exporting'>('idle');
  const [result, setResult] = useState<string | null>(null);

  const handleImport = async () => {
    setLoading('importing');
    setResult(null);
    const res = await pickAndImport();
    setLoading('idle');
    setResult(res.message);
    if (res.success && (res.categoriesAdded > 0 || res.itemsAdded > 0)) {
      onImportComplete();
    }
  };

  const handleExport = async () => {
    setLoading('exporting');
    setResult(null);
    try {
      await exportAndShare();
    } catch {
      setResult('حدث خطأ أثناء التصدير');
    }
    setLoading('idle');
  };

  const handleClose = () => {
    setResult(null);
    setLoading('idle');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={[styles.content, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>استيراد / تصدير البيانات</Text>

          {loading === 'idle' && !result && (
            <View style={styles.buttons}>
              <Pressable
                onPress={handleImport}
                style={[styles.btn, { backgroundColor: theme.backgroundElement }]}
              >
                <Text style={[styles.btnText, { color: theme.text }]}>📥 استيراد من ملف</Text>
              </Pressable>
              <Pressable
                onPress={handleExport}
                style={[styles.btn, { backgroundColor: theme.backgroundElement }]}
              >
                <Text style={[styles.btnText, { color: theme.text }]}>📤 تصدير إلى ملف</Text>
              </Pressable>
            </View>
          )}

          {loading !== 'idle' && (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={theme.text} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                {loading === 'importing' ? 'جاري الاستيراد...' : 'جاري التصدير...'}
              </Text>
            </View>
          )}

          {result && (
            <View style={styles.center}>
              <Text style={[styles.resultText, { color: theme.text }]}>{result}</Text>
            </View>
          )}

          <Pressable onPress={handleClose} style={[styles.closeBtn, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.closeText, { color: theme.textSecondary }]}>إغلاق</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: Spacing.four,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center',
  },
  buttons: {
    gap: Spacing.two,
  },
  btn: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three + Spacing.one,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 17,
    fontFamily: 'Cairo_700Bold',
  },
  center: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
  },
  loadingText: {
    marginTop: Spacing.three,
    fontSize: 15,
    fontFamily: 'Cairo_600SemiBold',
  },
  resultText: {
    fontSize: 15,
    fontFamily: 'Cairo_600SemiBold',
    textAlign: 'right',
    lineHeight: 24,
  },
  closeBtn: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontFamily: 'Cairo_700Bold',
  },
});
