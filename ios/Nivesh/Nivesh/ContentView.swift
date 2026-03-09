import SwiftUI
import WebKit

struct ContentView: View {
    @State private var isLoading = true

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            NiveshWebView(isLoading: $isLoading)
                .ignoresSafeArea(edges: .bottom)

            if isLoading {
                LaunchScreen()
                    .transition(.opacity)
            }
        }
        .animation(.easeOut(duration: 0.4), value: isLoading)
    }
}

// MARK: - Launch Screen
struct LaunchScreen: View {
    @State private var pulse = false

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            VStack(spacing: 8) {
                Text("N")
                    .font(.system(size: 64, weight: .bold, design: .rounded))
                    .foregroundColor(Color(red: 232/255, green: 39/255, blue: 44/255))
                    .scaleEffect(pulse ? 1.05 : 1.0)
                    .animation(.easeInOut(duration: 1.2).repeatForever(autoreverses: true), value: pulse)

                Text("Nivesh")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundColor(.white)

                Text("INVESTMENT BY HVM")
                    .font(.system(size: 10, weight: .semibold))
                    .tracking(3)
                    .foregroundColor(.white.opacity(0.3))
            }
            .onAppear { pulse = true }
        }
    }
}

// MARK: - WKWebView Wrapper
struct NiveshWebView: UIViewRepresentable {
    @Binding var isLoading: Bool

    // CHANGE THIS to your GitHub Pages URL after deploying
    let pageURL = "https://harshvm59.github.io/nivesh/"

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        webView.scrollView.bounces = true
        webView.isOpaque = false
        webView.backgroundColor = .black
        webView.scrollView.backgroundColor = .black

        // Allow zooming to be disabled by the page
        webView.scrollView.maximumZoomScale = 1.0
        webView.scrollView.minimumZoomScale = 1.0

        // Load the dashboard
        if let url = URL(string: pageURL) {
            webView.load(URLRequest(url: url))
        }

        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    class Coordinator: NSObject, WKNavigationDelegate {
        var parent: NiveshWebView

        init(_ parent: NiveshWebView) {
            self.parent = parent
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            // Small delay for page JS to render
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
                self.parent.isLoading = false
            }
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            self.parent.isLoading = false
        }
    }
}

#Preview {
    ContentView()
}
